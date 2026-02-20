import { MakeResource as MakeResourceBase } from "resora";

export class MakeResource extends MakeResourceBase {
  signature = `#make:
        {resource : Generates a new resource file.
            | {name : Name of the resource to create}
            | {--c|collection : Make a resource collection}
            | {--force : Create the resource or collection file even if it already exists.}
        }
        {collection : Create a new resource collection file.
            | {name : Name of the resource collection to create}
            | {--force : Create the resource or collection file even if it already exists.}
        }
        {all : Create both resource and collection files.
            | {prefix : prefix of the resources to create, "Admin" will create AdminResource, AdminCollection} 
            | {--force : Create the resource or collection file even if it already exists.}
        }
    `;

  description = "Create a new resource or resource collection file";
}
