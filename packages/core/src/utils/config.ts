import { z } from "zod";

const EnvSchema = z.object({
  MONGODB_URI: z.string().default(`mongodb://root:root@localhost:27017/`),
  MONGO_DATABASE: z.string().default("scraper"),
  CONFIRMATION_BLOCKS: z.coerce.number().default(15),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

const loadConfig = (env: NodeJS.ProcessEnv): EnvConfig => {
  try {
    return EnvSchema.parse({
      MONGODB_URI: env.MONGODB_URI,
      MONGO_DATABASE: env.MONGO_DATABASE,
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
