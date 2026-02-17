import { H3, serve } from "h3";
import { facebookStrategy, googleStrategy } from "./utils/passport";

import ErrorHandler from "./utils/request-handlers";
import { Router } from "@core/Router";
import { cors } from "../core/middlewares/cors";
import { env } from "./utils/helpers";
// import methodOverride from "method-override";
import passport from "passport";
import { prisma } from "@core/DB";
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

    // Method Override
    // this.app.use(methodOverride("X-HTTP-Method"));

    // Handle CORS
    this.app.use(cors());

    // Passport
    if (env("GOOGLE_CLIENT_ID")) {
      passport.use(googleStrategy());
    }
    if (env("FACEBOOK_CLIENT_ID")) {
      passport.use(facebookStrategy());
    }

    // Bind the router
    Router.bind(this.app);

    // Start the server
    serve(this.app, { port, silent: true });
    console.log(`Server is running on http://localhost:${port}`);
  }

  async shutdown() {
    await prisma.$disconnect();
    process.exit(0);
  }
}
