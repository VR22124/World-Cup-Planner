/**
 * Environment configuration validated at startup via Zod.
 *
 * If any required variable is missing or malformed the process exits
 * immediately with a human-readable error, preventing silent failures.
 */

import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  DATABASE_URL: z.string().optional(),
});

/** Validated environment — safe to destructure anywhere in the app. */
export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env: Env = parsed.data;
