import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyMongodb from "@fastify/mongodb";
import { config } from "@evm-indexer/core";
import { feeCollectorEventsRoutes } from "./modules";
import mongoose from "mongoose";

const startApp = async () => {
  const fastify = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
    exposeHeadRoutes: false,
  })
    .register(cors)
    .register(feeCollectorEventsRoutes, { prefix: "/fee-collector-events" });

  await mongoose.connect(config.MONGODB_URI, {
    dbName: config.MONGO_DATABASE,
  });

  console.log("MongoDB connection established with Mongoose.");

  fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

export default startApp;
