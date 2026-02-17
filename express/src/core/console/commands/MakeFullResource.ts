import { makeController, makeResource } from "../actions";

import { Command } from "@h3ravel/musket";

export class MakeFullResource extends Command {
    protected signature = `make:full-resource
        {prefix : prefix of the resources to create, "Admin" will create AdminResource, AdminCollection and AdminController} 
        {--collection : make a resource collection}
    `;

    protected description = 'Create a full new set of API resources (Controller, Resource, Collection)';

    async handle () {
        makeResource(this.argument("prefix"), {});
        makeResource(this.argument("prefix") + "Collection", { collection: true });
        makeController(this.argument("prefix"), Object.assign({}, this.options(), { api: true }));
    }
}