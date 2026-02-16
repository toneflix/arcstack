import { Router as ClearRouter } from "clear-router/h3";
import { H3 } from "h3";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export class Router extends ClearRouter {
  static bind(app: H3) {
    ClearRouter.group("/api", () => {
      require("src/routes/api");
    });

    ClearRouter.group("/", () => {
      require("src/routes/web");
    });

    const router = ClearRouter.apply(app);

    return router;
  }

  static list(_options: { path?: string }) {
    console.log("Registered Routes:", this.allRoutes());
  }
}
