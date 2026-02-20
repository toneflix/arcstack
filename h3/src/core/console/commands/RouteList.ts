import { App } from "../app";
import { Command } from "@h3ravel/musket";
import { Router } from "src/core/router";

export class RouteList extends Command<App> {
  protected signature = `route:list
        {--p|path? : Path to filter routes by}
    `;

  protected description = "List all registered routes";

  async handle() {
    console.log(Router.list(this.options(), this.app.core.getH3Instance()));
  }
}
