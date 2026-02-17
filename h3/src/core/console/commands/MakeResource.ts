import { Command } from "@h3ravel/musket";
import { makeResource } from "../actions";

export class MakeResource extends Command {
  protected signature = `make:resource
        {name : name of the resource to create} 
        {--c|collection : make a resource collection}
    `;

  protected description = "Create a new resource or resource collection file";

  async handle() {
    const name = makeResource(this.argument("name"), this.options());

    this.success(`Created resource: ${name}`);
  }
}
