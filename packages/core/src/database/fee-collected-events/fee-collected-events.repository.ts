import {
  FeeCollectedEvent,
  FeeCollectedEventModel,
} from "./fee-collected-events.model";

export class FeeCollectedEventRepository {
  async insertMany(events: FeeCollectedEvent[]): Promise<FeeCollectedEvent[]> {
    return await FeeCollectedEventModel.insertMany(events, { ordered: false });
  }
}
