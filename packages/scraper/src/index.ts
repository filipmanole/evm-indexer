import "reflect-metadata";
import { config } from "@evm-indexer/core";
import { EventScraper } from "./scraper.service";

async function main() {
  const scraper = new EventScraper({
    rpcUrl: config.POLYGON_RPC,
    contractAddress: config.CONTRACT_ADDRESS,
    chainId: 137,
    chunkSize: 2000,
    confirmations: 15,
    // initialBlock: 61_500_000,
    initialBlock: 68_515_067,
  });

  console.log("LOG");
  // await scraper.start();
}

main().catch((error) => {
  console.error("Application failed to start:", error);
  process.exit(1);
});
