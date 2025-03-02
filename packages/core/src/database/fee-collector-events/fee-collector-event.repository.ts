import {
  FeeCollectorEvent,
  FeeCollectorEventModel,
} from "./fee-collector-event.model";

export class FeeCollectorEventRepository {
  async insertMany(events: FeeCollectorEvent[]): Promise<FeeCollectorEvent[]> {
    return await FeeCollectorEventModel.insertMany(events, { ordered: false });
  }

  async list(page: number, limit: number) {
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);

    const [items, total] = await Promise.all([
      FeeCollectorEventModel.find()
        .sort({ blockNumber: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      FeeCollectorEventModel.countDocuments(),
    ]);

    return {
      data: items,
      total,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}

export const feeCollectorEventRepository = new FeeCollectorEventRepository();
