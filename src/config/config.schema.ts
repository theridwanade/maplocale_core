import { z } from "zod";

export const configSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number(),
});

export type Config = z.infer<typeof configSchema>;

export const validate = (config) => {
  const parsed = configSchema.safeParse(config);
  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
};
