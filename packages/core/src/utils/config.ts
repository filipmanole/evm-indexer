import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["prod", "dev"]).default("dev"),
  MONGODB_URI: z.string().default(`mongodb://root:root@localhost:27017/`),
  POLYGON_RPC: z.string().default("https://polygon-rpc.com"),
  SCRAPER_INTERVAL_MS: z.coerce.number().min(1000).default(15_000),
  CONFIRMATION_BLOCKS: z.coerce.number().min(5).default(15),
  CONTRACT_ADDRESS: z
    .string()
    .default("0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9"),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

const loadConfig = (env: NodeJS.ProcessEnv): EnvConfig => {
  try {
    return EnvSchema.parse({
      NODE_ENV: env.NODE_ENV,
      MONGODB_URI: env.MONGODB_URI,
      POLYGON_RPC: env.POLYGON_RPC,
      SCRAPER_INTERVAL_MS: env.SCRAPER_INTERVAL_MS,
      CONFIRMATION_BLOCKS: env.CONFIRMATION_BLOCKS,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid environment variables:");

      error.issues.forEach((issue) => {
        console.error(`➤ ${issue.path.join(".")}: ${issue.message}`);
      });
    }
    process.exit(1);
  }
};

export const config = Object.freeze(loadConfig(process.env));
