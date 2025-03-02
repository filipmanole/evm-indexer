import { BigNumber, ethers } from "ethers";
import { FeeCollector__factory } from "lifi-contract-typings";
import {
  config,
  FeeCollectedEventModel,
  LastBlockModel,
} from "@evm-indexer/core";

export class EventScraper {
  private readonly CHUNK_SIZE = 2000; // Process 2000 blocks per execution
  private readonly CHAIN_ID = 137; // Polygon

  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(
    private readonly rpcUrl: string,
    private readonly contractAddress: string
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
    this.contract = new ethers.Contract(
      this.contractAddress,
      FeeCollector__factory.createInterface(),
      this.provider
    );
  }

  async processNextBatch(): Promise<void> {
    try {
      const [lastProcessedBlock, currentBlock] = await Promise.all([
        this.getLastProcessedBlock(),
        this.provider
          .getBlockNumber()
          .then((b) => b - config.CONFIRMATION_BLOCKS),
      ]);

      if (lastProcessedBlock >= currentBlock) {
        console.info("No new blocks to process");
        return;
      }

      const toBlock = Math.min(
        lastProcessedBlock + this.CHUNK_SIZE,
        currentBlock
      );

      console.info(`Processing blocks ${lastProcessedBlock + 1}-${toBlock}`);

      const events = await this.loadEvents(lastProcessedBlock + 1, toBlock);

      await this.saveEvents(events);

      await LastBlockModel.findOneAndUpdate(
        { chainId: this.CHAIN_ID },
        { $set: { lastBlock: toBlock } },
        { upsert: true }
      );

      console.info(`Successfully processed up to block ${toBlock}`);
    } catch (error) {
      console.error("Error processing batch:", error);
      throw error;
    }
  }

  private async loadEvents(fromBlock: number, toBlock: number) {
    const filter = this.contract.filters.FeesCollected();
    const events = await this.contract.queryFilter(filter, fromBlock, toBlock);

    return Promise.all(
      events.map(async (event) => {
        const parsed = this.contract.interface.parseLog(event);
        const block = await event.getBlock();

        return {
          chainId: this.CHAIN_ID,
          token: parsed.args[0],
          integrator: parsed.args[1],
          integratorFee: BigNumber.from(parsed.args[2]),
          lifiFee: BigNumber.from(parsed.args[3]),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
          logIndex: event.logIndex,
          timestamp: new Date(block.timestamp * 1000),
        };
      })
    );
  }

  private async saveEvents(events: any[]) {
    if (events.length === 0) return;

    try {
      await FeeCollectedEventModel.insertMany(events, { ordered: false });
      console.info(`Stored ${events.length} events`);
    } catch (error: any) {
      if (error?.code === 11000) {
        console.warn(
          `Ignored ${error.result?.nInserted ?? 0} duplicate events`
        );
      } else {
        throw error;
      }
    }
  }

  private async getLastProcessedBlock(): Promise<number> {
    const doc = await LastBlockModel.findOne({ chainId: this.CHAIN_ID });
    return doc?.lastBlock ?? config.OLDEST_BLOCK;
  }
}
