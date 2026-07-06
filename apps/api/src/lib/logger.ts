/**
 * Application-wide structured logger (pino).
 *
 * - Production: JSON output (machine-parseable for log aggregators).
 * - Development: pino-pretty with colour for human readability.
 * - Sensitive headers are automatically redacted.
 */

import pino from "pino";

const isProduction = process.env["NODE_ENV"] === "production";

export const logger = pino({
  level: process.env["LOG_LEVEL"] ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
