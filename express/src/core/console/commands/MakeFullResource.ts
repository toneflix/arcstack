import { makeController, makeResource } from "../actions";

import { Command } from "@h3ravel/musket";

export class MakeFullResource extends Command {
  protected signature = `make:full-resource
        {prefix : prefix of the resources to create, "Admin" will create AdminResource, AdminCollection and AdminController} 
        {--m|model? : name of model to attach to the generated controller}
    `;

  protected description =
    "Create a full new set of API resources (Controller, Resource, Collection)";

  async handle() {
    const name1 = makeResource(this.argument("prefix"), {});
    const name2 = makeResource(this.argument("prefix") + "Collection", { collection: true });
    const name3 = makeController(
      this.argument("prefix"),
      Object.assign({}, this.options(), { api: true }),
    );
    this.success(`Created full resource set: ${name1}, ${name2}, ${name3}`);
  }
}
