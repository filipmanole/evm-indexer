import cron from "node-cron";
import { EventScraper } from "./scraper.service";
import { config } from "@evm-indexer/core";
import mongoose from "mongoose";

const scraper = new EventScraper(config.POLYGON_RPC, config.CONTRACT_ADDRESS);

cron.schedule("* * * * *", async () => {
  const db = await mongoose.connect(config.MONGODB_URI);
  try {
    await scraper.processNextBatch();
  } catch (error) {
    console.error("Cronjob failed:", error);
  } finally {
    db.disconnect();
  }
});

// async function run() {
//   const scraper = new EventScraper(config.POLYGON_RPC, config.CONTRACT_ADDRESS);

//   try {
//     // Connect to MongoDB first
//     await mongoose.connect(config.MONGODB_URI);
//     console.log("MongoDB connected");

//     // Run the scraper process
//     await scraper.processNextBatch();
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     // Disconnect after everything completes
//     await mongoose.disconnect();
//     console.log("MongoDB disconnected");
//   }
// }

// run();
