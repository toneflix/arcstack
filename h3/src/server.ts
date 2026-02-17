import { app } from "./core/bootstrap";
import { detect } from "detect-port";

detect(3000).then(async (port) => {
  await app.boot(port);

  // Handle graceful shutdown
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
    process.on(signal, async () => await app.shutdown());
  });
});
