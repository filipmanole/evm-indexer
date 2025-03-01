import { FeeCollector__factory } from "lifi-contract-typings";
import { ethers } from "ethers";
import { FeeCollectedEventModel, LastBlockModel } from "@evm-indexer/core";

interface ScraperConfig {
  rpcUrl: string;
  contractAddress: string;
  chainId: number;
  chunkSize: number;
  confirmations: number;
  initialBlock: number;
}

export class EventScraper {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private isProcessing = false;
  private config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = config;
    this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    this.contract = new ethers.Contract(
      config.contractAddress,
      FeeCollector__factory.createInterface(),
      this.provider
    );
  }

  async start() {
    try {
      await this.initializeLastBlock();
      // await this.processHistoricalBlocks();
      // this.startPolling();
    } catch (error) {
      console.error("Failed to initialize scraper:", error);
      process.exit(1);
    }
  }

  private async initializeLastBlock() {
    console.log(this.config.chainId);
    const existing = await LastBlockModel.findOne({
      chainId: this.config.chainId,
    });
    if (!existing) {
      await LastBlockModel.create({
        chainId: this.config.chainId,
        lastBlock: this.config.initialBlock - 1,
      });
      console.info(`Initialized last block for chain ${this.config.chainId}`);
    }
  }

  private async processHistoricalBlocks() {
    let lastProcessedBlock = await this.getLastProcessedBlock();
    const currentBlock = await this.getSafeBlockNumber();

    while (lastProcessedBlock < currentBlock) {
      const toBlock = Math.min(
        lastProcessedBlock + this.config.chunkSize,
        currentBlock
      );

      console.info(`Processing blocks ${lastProcessedBlock + 1}-${toBlock}`);

      try {
        const events = await this.loadEvents(lastProcessedBlock + 1, toBlock);
        await this.saveEvents(events);

        await LastBlockModel.findOneAndUpdate(
          { chainId: this.config.chainId },
          { $set: { lastBlock: toBlock } },
          { upsert: true }
        );

        lastProcessedBlock = toBlock;
      } catch (error) {
        console.error(
          `Failed processing blocks ${lastProcessedBlock + 1}-${toBlock}:`,
          error
        );
        await this.waitWithBackoff();
      }
    }
  }

  private startPolling() {
    setInterval(async () => {
      if (this.isProcessing) return;
      this.isProcessing = true;

      try {
        const lastProcessed = await this.getLastProcessedBlock();
        const currentBlock = await this.getSafeBlockNumber();

        if (currentBlock > lastProcessed) {
          await this.processNewBlocks(lastProcessed + 1, currentBlock);
        }
      } catch (error) {
        console.error("Polling error:", error);
      } finally {
        this.isProcessing = false;
      }
    }, 15_000); // Poll every 15 seconds
  }

  private async processNewBlocks(fromBlock: number, toBlock: number) {
    try {
      const events = await this.loadEvents(fromBlock, toBlock);
      await this.saveEvents(events);

      await LastBlockModel.findOneAndUpdate(
        { chainId: this.config.chainId },
        { $set: { lastBlock: toBlock } },
        { upsert: true }
      );

      console.info(`Successfully processed blocks ${fromBlock}-${toBlock}`);
    } catch (error) {
      console.error(
        `Failed processing new blocks ${fromBlock}-${toBlock}:`,
        error
      );
      throw error;
    }
  }

  private async loadEvents(fromBlock: number, toBlock: number) {
    try {
      const filter = this.contract.filters.FeesCollected();
      const events = await this.contract.queryFilter(
        filter,
        fromBlock,
        toBlock
      );

      return events.map(async (event) => {
        const parsed = this.contract.interface.parseLog(event);
        return {
          chainId: this.config.chainId,
          token: parsed.args[0],
          integrator: parsed.args[1],
          integratorFee: parsed.args[2].toString(),
          lifiFee: parsed.args[3].toString(),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
          logIndex: event.logIndex,
          timestamp: new Date((await event.getBlock()).timestamp * 1000),
        };
      });
    } catch (error) {
      console.error(
        `Failed loading events for blocks ${fromBlock}-${toBlock}:`,
        error
      );
      throw error;
    }
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
    const doc = await LastBlockModel.findOne({ chainId: this.config.chainId });
    return doc?.lastBlock ?? this.config.initialBlock - 1;
  }

  private async getSafeBlockNumber(): Promise<number> {
    const currentBlock = await this.provider.getBlockNumber();
    return currentBlock - this.config.confirmations;
  }

  private async waitWithBackoff(retries = 3, baseDelay = 1000) {
    if (retries <= 0) return;

    const delay = baseDelay * 2 ** (3 - retries);
    console.info(`Waiting ${delay}ms before retry...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
