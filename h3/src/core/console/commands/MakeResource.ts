import { Command } from "@h3ravel/musket";
import { makeResource } from "../actions";

export class MakeResource extends Command {
    protected signature = `make:resource
        {name : name of the resource to create} 
        {--m|model? : name of model to attach to the generated controller}
    `;

    protected description = 'Create a new resource or resource collection file';

    async handle () {
        makeResource(this.argument("name"), this.options());
    }
}