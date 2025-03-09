import {
  feeCollectorEventRepository,
  FeeCollectorEventRepository,
} from "@evm-indexer/core";

export class FeeCollectorEventsService {
  #feeCollectorEventsRepository: FeeCollectorEventRepository;

  constructor(feeCollectorEventsRepository: FeeCollectorEventRepository) {
    this.#feeCollectorEventsRepository = feeCollectorEventsRepository;
  }

  async list(integrator: string, page?: number, limit?: number) {
    const users = await this.#feeCollectorEventsRepository.list(
      integrator,
      page ?? 1,
      limit ?? 10
    );
    return users;
  }
}

export const feeCollectorEventsService = new FeeCollectorEventsService(
  feeCollectorEventRepository
);
