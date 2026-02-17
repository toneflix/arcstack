import Application from "src/core/app";
import { Command } from "@h3ravel/musket";
import { Router } from "src/core/Router";

export class RouteList extends Command<Application> {
  protected signature = `route:list
        {--p|path? : Path to filter routes by}
    `;

  protected description = "List all registered routes";

  async handle() {
    console.log(Router.list(this.options()));
  }
}
