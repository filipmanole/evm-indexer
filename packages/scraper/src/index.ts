import cron from "node-cron";
import mongoose from "mongoose";
import { EventScraper } from "./scraper.service";
import { config, ScraperConfigModel } from "@evm-indexer/core";

cron.schedule("* * * * *", async () => {
  let dbConnection: mongoose.Mongoose | undefined;
  try {
    dbConnection = await mongoose.connect(config.MONGODB_URI);

    const scraperConfigs = await ScraperConfigModel.find();

    if (scraperConfigs.length === 0) {
      console.error("No chain configurations existing. Skipping...");
      return;
    }

    for (const config of scraperConfigs) {
      try {
        const { isActive, chunkSize } = config.settings;

        if (isActive) {
          const scraper = new EventScraper(config);
          await scraper.processNextBatch(chunkSize);
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
