import { createApp } from "./app.js";
import { env } from "./core/config/env.js";
import { logger } from "./core/logger/logger.js";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(
    `🚀 LocalIA API escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`,
  );
});
