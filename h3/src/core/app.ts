import { H3, serve } from "h3";

import ErrorHandler from "./utils/request-handlers";
import { Router } from "src/core/router";
import config from "src/config/middleware";
import { prisma } from "src/core/database";
import { staticAssetHandler } from "./middlewares/generic";

export default class Application {
  private app: H3;
  private static app: H3;

  constructor(app?: H3) {
    this.app =
      app ??
      new H3({
        onError: ErrorHandler,
      });

    Application.app = this.app;
  }

  getH3Instance() {
    return this.app;
  }

  static getH3Instance() {
    return Application.app;
  }

  public async boot(port: number) {
    // Load public assets
    this.app.use(staticAssetHandler());

    // Bind the router
    Router.bind(this.app);

    for (const middleware of config(this.app).global) {
      this.app.use(
        Array.isArray(middleware) ? middleware[0] : middleware,
        Array.isArray(middleware) ? middleware[1] : undefined,
      );
    }

    // Start the server
    serve(this.app, { port });

    // Handle graceful shutdown
    ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
      process.on(signal, async () => await this.shutdown());
    });
  }

  async shutdown() {
    await prisma.$disconnect();
    process.exit(0);
  }
}
