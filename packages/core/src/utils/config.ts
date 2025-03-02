import { z } from "zod";

const EnvSchema = z.object({
  MONGODB_URI: z.string().default(`mongodb://root:root@localhost:27017/`),
  POLYGON_RPC: z.string().default("https://polygon-rpc.com"),
  CONTRACT_ADDRESS: z
    .string()
    .default("0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9"),
  CONFIRMATION_BLOCKS: z.number().default(15),
  OLDEST_BLOCK: z.number().default(68_534_729),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

const loadConfig = (env: NodeJS.ProcessEnv): EnvConfig => {
  try {
    return EnvSchema.parse({
      MONGODB_URI: env.MONGODB_URI,
      POLYGON_RPC: env.POLYGON_RPC,
      CONTRACT_ADDRESS: env.CONTRACT_ADDRESS,
      CONFIRMATION_BLOCKS: env.CONFIRMATION_BLOCKS,
      OLDEST_BLOCK: env.OLDEST_BLOCK,
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
