import { LastBlock, LastBlockModel } from "./last-block.model";

export class LastBlockRepository {
  async findByChainId(chainId: number): Promise<LastBlock | null> {
    const res = await LastBlockModel.findOne({ chainId });

    return res;
  }

  async updateForChainId(
    chainId: number,
    data: Partial<LastBlock>
  ): Promise<LastBlock> {
    const res = await LastBlockModel.findOneAndUpdate(
      { chainId },
      { $set: data },
      { upsert: true }
    );

    if (!res) throw Error(`Error updating last block for chain ${chainId}`);

    return res;
  }
}
