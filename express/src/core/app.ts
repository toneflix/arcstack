import express, { Express } from "express";

import ErrorHandler from "./utils/request-handlers";
import { Router } from "src/core/router";
import config from "src/config/middleware";
import path from "path";
import { prisma } from "src/core/database";

export default class Application {
  private app: Express;
  private static app: Express;

  constructor(app?: Express) {
    this.app = app ?? express();
    Application.app = this.app;
  }

  static getExpressInstance() {
    return Application.app;
  }

  public async boot(port: number) {
    // Load public assets
    this.app.use(express.static(path.join(process.cwd(), "public")));

    // Bind the router
    this.app.use(Router.bind());

    // Error Handler
    this.app.use(ErrorHandler);

    for (const middleware of config(this.app).global) {
      this.app.use(middleware);
    }

    // Start the server
    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

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
