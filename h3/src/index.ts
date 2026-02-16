import Application from "src/core/app";
import ErrorHandler from "./core/utils/request-handlers";
import { H3 } from "h3";
import { detect } from "detect-port";

detect(3000).then(async (port) => {
  const app = new Application(
    new H3({
      onError: ErrorHandler,
    }),
  );

  await app.boot(port);

  // Handle graceful shutdown
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
    process.on(signal, async () => await app.shutdown());
  });
});
// .catch(() => {
//     process.exit(1);
// });
