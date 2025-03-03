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
    const { page = 1, limit = 10 } = req.query as {
      page?: number;
      limit?: number;
    };
    try {
      const users = await this.#feeCollectorEventsService.list(page, limit);
      return reply.send(users);
    } catch (err) {
      reply.status(500).send(err);
    }
  }
}

export const feeCollectorEventsController = new FeeCollectorEventsController(
  feeCollectorEventsService
);
