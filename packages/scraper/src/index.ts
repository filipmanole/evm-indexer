import cron from "node-cron";
import mongoose from "mongoose";
import { EventScraper } from "./scraper.service";
import { config, scraperConfigRepository } from "@evm-indexer/core";

cron.schedule("* * * * *", async () => {
  let dbConnection: mongoose.Mongoose | undefined;
  try {
    dbConnection = await mongoose.connect(config.MONGODB_URI, {
      dbName: config.MONGO_DATABASE,
    });

    const scraperConfigs = await scraperConfigRepository.listScraperConfigs();

    if (scraperConfigs.length === 0) {
      console.error("No chain configurations existing. Skipping...");
      return;
    }

    for (const config of scraperConfigs) {
      try {
        const { isActive, chunkSize } = config.settings;

        if (isActive) {
          const scraper = new EventScraper(config);
          const lastProcesedBlock = await scraper.processNextBatch(
            config.lastBlock,
            chunkSize
          );
          await scraperConfigRepository.updateForChainId(config.chainId, {
            lastBlock: lastProcesedBlock,
          });
        } else {
          console.warn(`Skipping inactive scraper for chain ${config.chainId}`);
        }
      } catch (error) {
        console.error(`Error on chain ${config.chainId}`, error);
      }
    }
  } catch (error) {
    console.error("Cronjob failed:", error);
  } finally {
    dbConnection?.disconnect();
  }
});
