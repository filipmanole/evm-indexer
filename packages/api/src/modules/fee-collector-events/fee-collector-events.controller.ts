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
    const {
      page = 1,
      limit = 10,
      integrator,
    } = req.query as {
      page?: number;
      limit?: number;
      integrator: string;
    };

    if (!integrator) reply.status(400).send("integrator not provided");

    try {
      const users = await this.#feeCollectorEventsService.list(
        integrator,
        page,
        limit
      );
      return reply.send(users);
    } catch (err) {
      reply.status(500).send(err);
    }
  }
}

export const feeCollectorEventsController = new FeeCollectorEventsController(
  feeCollectorEventsService
);
