import { FastifyInstance } from "fastify";
import { feeCollectorEventsController } from "./fee-collector-events.controller";

export const feeCollectorEventsRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/list",
    feeCollectorEventsController.list.bind(feeCollectorEventsController)
  );
};
