import { App } from "../app";
import { Command } from "@h3ravel/musket";

export class MakeFullResource extends Command<App> {
  protected signature = `make:full-resource
        {prefix : prefix of the resources to create, "Admin" will create AdminResource, AdminCollection and AdminController} 
        {--m|model? : name of model to attach to the generated controller}
        {--force : force overwrite if resources already exist}
    `;

  protected description =
    "Create a full new set of API resources (Controller, Resource, Collection)";

  async handle() {
    this.app.command = this;

    const res1 = this.app.makeResource(this.argument("prefix"), {});
    const res2 = this.app.makeResource(this.argument("prefix") + "Collection", {
      collection: true,
    });
    const name3 = this.app.makeController(
      this.argument("prefix"),
      Object.assign({}, this.options(), { api: true }),
    );
    this.success(`Created full resource set: ${res1.name}, ${res2.name}, ${name3}`);
  }
}
