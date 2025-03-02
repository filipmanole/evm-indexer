import {
  FeeCollectorEvent,
  FeeCollectorEventModel,
} from "./fee-collector-event.model";

export class FeeCollectorEventRepository {
  async insertMany(events: FeeCollectorEvent[]): Promise<FeeCollectorEvent[]> {
    return await FeeCollectorEventModel.insertMany(events, { ordered: false });
  }

  async list() {}
}

export const feeCollectorEventRepository = new FeeCollectorEventRepository();
