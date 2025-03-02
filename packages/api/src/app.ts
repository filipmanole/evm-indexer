import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyMongodb from "@fastify/mongodb";
import { config } from "./utils";
import { feeCollectorEventsRoutes } from "./modules";

const startApp = () => {
  const fastify = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true, // Adds colors to logs
          translateTime: "HH:MM:ss Z", // Formats timestamps
          ignore: "pid,hostname", // Hides unnecessary fields
        },
      },
    },
    exposeHeadRoutes: false,
  })
    .register(cors)
    .register(fastifyMongodb, {
      forceClose: true,
      database: config.MONGO_DATABASE,
      url: config.MONGODB_URI,
    })
    .register(feeCollectorEventsRoutes, { prefix: "/fee-collector-events" });

  fastify.listen(
    { port: config.API_PORT, host: "0.0.0.0" },
    function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
    }
  );
};

export default startApp;
