/**
 * Server entry point.
 *
 * Validates the PORT environment variable and starts the Express HTTP server.
 * Graceful shutdown is handled to allow in-flight requests to complete.
 */

import app from "./app";
import { logger } from "./lib/logger";
import { env } from "./config/env";

const port = Number(env.PORT);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${env.PORT}"`);
}

const server = app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

// ---------------------------------------------------------------------------
// Graceful shutdown — close connections before process exit
// ---------------------------------------------------------------------------
function gracefulShutdown(signal: string): void {
  logger.info({ signal }, "Received shutdown signal, closing server…");
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
