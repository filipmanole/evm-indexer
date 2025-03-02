import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_PORT, MONGO_DATABASE } =
  process.env;

let databaseConnection: mongoose.Mongoose | undefined;

try {
  databaseConnection = await mongoose.connect(
    `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:${MONGO_PORT}/`,
    { dbName: MONGO_DATABASE }
  );

  const collection = mongoose.connection.db.collection("scraper_configs");

  const result = await collection.updateOne(
    { chainId: 137 },
    {
      $setOnInsert: {
        chainId: 137,
        contractAddress: "0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9",
        providerUri: "https://polygon-rpc.com",
        lastBlock: 61500000,
        settings: {
          chunkSize: 2000,
          isActive: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  if (result.upsertedCount > 0) {
    console.log("Inserted new document:", result.upsertedId);
  } else {
    console.log("Document already exists. No new insert.");
  }
} catch (error) {
  console.error("Could not add the scraper config", error);
} finally {
  databaseConnection?.disconnect();
}
