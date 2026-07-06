import app from "./app";
import { logger } from "./lib/logger";
import { env } from "./config/env";

const port = Number(env.PORT);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${env.PORT}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
