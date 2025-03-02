import { ScraperConfig, ScraperConfigModel } from "./scraper-config.model";

export class ScraperConfigRepository {
  async listScraperConfigs(): Promise<ScraperConfig[]> {
    return ScraperConfigModel.find();
  }

  async findByChainId(chainId: number): Promise<ScraperConfig | null> {
    const res = await ScraperConfigModel.findOne({ chainId });

    return res;
  }

  async updateForChainId(
    chainId: number,
    data: Partial<ScraperConfig>
  ): Promise<ScraperConfig> {
    const res = await ScraperConfigModel.findOneAndUpdate(
      { chainId },
      { $set: data },
      { upsert: true }
    );

    if (!res) throw Error(`Error updating last block for chain ${chainId}`);

    return res;
  }
}

export const scraperConfigRepository = new ScraperConfigRepository();
