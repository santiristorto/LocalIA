import { createApp } from "./app.js";
import { env } from "./core/config/env.js";
import { container } from "./core/container.js";
import { logger } from "./core/logger/logger.js";

const app = createApp(container);

app.listen(env.PORT, () => {
  logger.info(
    `🚀 LocalIA API escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`,
  );
});
