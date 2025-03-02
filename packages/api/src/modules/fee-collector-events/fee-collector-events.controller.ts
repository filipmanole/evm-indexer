import { FastifyRequest, FastifyReply } from "fastify";
import {
  feeCollectorEventsService,
  FeeCollectorEventsService,
} from "./fee-collector-events.service";

export class FeeCollectorEventsController {
  #feeCollectorEventsService: FeeCollectorEventsService;

  constructor(feeCollectorEventsService: FeeCollectorEventsService) {
    this.#feeCollectorEventsService = feeCollectorEventsService;
  }

  async list(req: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.#feeCollectorEventsService.list();
      return reply.send(users);
    } catch (err) {
      reply.status(500).send(err);
    }
  }
}

export const feeCollectorEventsController = new FeeCollectorEventsController(
  feeCollectorEventsService
);
