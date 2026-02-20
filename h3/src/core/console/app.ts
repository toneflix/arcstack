import "src/core/utils/prototypes";

import Application from "../app";
import { CliApp } from "resora";
import { existsSync } from "fs";
import { join } from "path";

export class App extends CliApp {
  constructor(public core: Application) {
    super();
  }

  /**
   * Command to create a new controller file
   *
   * @param name
   * @param options
   */
  makeController = (name: string, options: any) => {
    name = name.endsWith("Controller") ? name.replace(/controller/i, "") : name;

    const CONTROLLERS_DIR = join(process.cwd(), "src/app/http/controllers");
    const STUBS_DIR = join(process.cwd(), "src/core/console/stubs");
    const controllerName = name.endsWith("Controller") ? name : `${name}Controller`;
    const fileName = `${controllerName}.ts`;
    const outputPath = join(CONTROLLERS_DIR, fileName);
    const stubPath = join(
      STUBS_DIR,
      options.model
        ? (this.config.stubs as any).model
        : options.api
          ? (this.config.stubs as any).api
          : (this.config.stubs as any).controller,
    );

    if (!existsSync(stubPath)) {
      console.error(`Error: Stub file ${stubPath} not found.`);
      process.exit(1);
    }

    this.generateFile(
      stubPath,
      outputPath,
      {
        ControllerName: controllerName,
        ModelName: options.model?.camelCase(),
        Name: controllerName.replace(/controller/i, ""),
      },
      options,
    );

    return outputPath;
  };
}
