import { Router as ClearRouter } from "clear-router/express";
import { createRequire } from "module";
import express from "express";

const require = createRequire(import.meta.url);

export class Router extends ClearRouter {
  static bind() {
    const router = express.Router();

    ClearRouter.group("/api", () => {
      require("src/routes/api");
    });

    ClearRouter.group("/", () => {
      require("src/routes/web");
    });

    ClearRouter.apply(router);

    return router;
  }

  static list(_options: { path?: string }) {
    console.log("Registered Routes:", this.allRoutes());
  }
}
