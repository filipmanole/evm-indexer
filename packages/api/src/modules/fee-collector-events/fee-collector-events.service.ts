import { FastifyRequest, FastifyReply } from "fastify";
import {
  feeCollectorEventRepository,
  FeeCollectorEventRepository,
} from "@evm-indexer/core";

export class FeeCollectorEventsService {
  #feeCollectorEventsRepository: FeeCollectorEventRepository;

  constructor(userService: FeeCollectorEventRepository) {
    this.#feeCollectorEventsRepository = userService;
  }

  async list() {
    const users = await this.#feeCollectorEventsRepository.list();
    return users;
  }
}

export const feeCollectorEventsService = new FeeCollectorEventsService(
  feeCollectorEventRepository
);
