import { Command } from "@h3ravel/musket";
import { makeController } from "../actions";

export class MakeController extends Command {
    protected signature = `make:controller
        {name : name of the controller to create} 
        {--api : make an API controller} 
        {--m|model? : name of model to attach to controller}
    `;

    protected description = 'Create a new controller file';

    async handle () {
        makeController(this.argument("name"), this.options());
    }
}