import { Command } from "@h3ravel/musket";
import { altLogo } from "src/logo";
import inquirer from "inquirer";
import { AbortPromptError, ExitPromptError } from "@inquirer/core";
import { basename, join } from "node:path";
import { templates } from "src/templates";
import { Str } from "@h3ravel/support";
import Actions from "src/actions";
import ora from "ora";
import { Logger } from "@h3ravel/shared";

export class CreateToneflixNodejsCommand extends Command {
  protected signature = `create-toneflix-nodejs
        {location?: The location where this project should be created relative to the current dir.}
        {--n|name?: The name of your project.}
        {--i|install: Install node_modules right away}
        {--t|token?: Kit repo authentication token.}
        {--d|desc?: Project Description.}
        {--k|kit?: Starter template kit.}
        {--p|pre: Download prerelease version if available.}
        {--o|overwrite: Overwrite the installation directory if it is not empty.}
    `;
  protected description = "Display a personalized greeting.";

  async handle() {
    const options = this.options();
    const pathName = this.argument("location");

    console.log(altLogo, `font-family: monospace`);

    let { template } = await inquirer
      .prompt([
        {
          type: "list",
          name: "template",
          message: "Choose starter template kit:",
          choices: <never>templates.map((e) => ({
            name: e.name,
            value: e.alias,
            disabled: !e.source ? "(Unavailable at this time)" : false,
          })),
          default: "full",
          when: () => !options.kit,
        },
      ])
      .catch((err) => {
        if (err instanceof AbortPromptError || err instanceof ExitPromptError) {
          this.info("Thanks for trying out our starter kit.");
          process.exit(0);
        }
        return err;
      });

    let { appName, description } = await inquirer
      .prompt([
        {
          type: "input",
          name: "appName",
          message: "What is the name of your project:",
          default: "toneflix-nodejs",
          when: () => !options.name,
        },
        {
          type: "input",
          name: "description",
          message: "Project Description:",
          default: `Simple ${template} project created with Toneflix's Node.js starter kit.`,
          when: () => !options.desc,
        },
      ])
      .catch((err) => {
        if (err instanceof AbortPromptError || err instanceof ExitPromptError) {
          this.info("Thanks for trying out our starter kit.");
          process.exit(0);
        }
        return err;
      });

    let { location } = await inquirer
      .prompt([
        {
          type: "input",
          name: "location",
          message: "Installation location relative to the current dir:",
          default: Str.slugify(options.name ?? appName ?? basename(process.cwd()), "-"),
          when: () => !pathName,
        },
      ])
      .catch((err) => {
        if (err instanceof AbortPromptError || err instanceof ExitPromptError) {
          this.info("Thanks for trying out our starter kit.");
          process.exit(0);
        }
        return err;
      });

    /**
     * Find selected template kit
     */
    const kit = templates.find((e) => e.alias === template)!;

    // oxlint-disable-next-line no-unused-vars
    let { install, token, pre } = await inquirer
      .prompt([
        {
          type: "confirm",
          name: "pre",
          message: `An alpha version of the ${kit.name.replace(/\s*kit$/i, "").trim()} kit is available. Would you like to use it instead?`,
          default: false,
          when: () => kit.prereleaseSource && !options.pre,
        } as never,
        {
          type: "input",
          name: "token",
          message: "Authentication token:",
          when: () => options.kit && !options.token,
        },
        {
          type: "confirm",
          name: "install",
          message: "Would you want to install node_modules right away:",
          default: true,
          when: () => !options.install,
        },
      ])
      .catch((err) => {
        if (err instanceof AbortPromptError || err instanceof ExitPromptError) {
          this.info("Thanks for trying out our starter kit.");
          process.exit(0);
        }
        return err;
      });

    pre = options.pre ?? pre;
    token = options.token ?? token;
    appName = options.name ?? appName;
    install = options.install ?? install;
    template = options.kit ?? template;
    location = pathName ?? location;
    description = options.description ?? description;

    /**
     * Validate selected kit
     */
    if (kit && !kit.source) {
      this.error(`ERROR: The ${kit.name} kit is not currently available`);
      process.exit(1);
    }

    const source: string = pre && kit.prereleaseSource ? kit.prereleaseSource! : kit.source;
    const actions = new Actions(join(process.cwd(), location), appName, description);
    const spinner = ora(`Loading Template...`).start();

    await actions.download(source, install, undefined, options.overwrite);

    spinner.info(Logger.parse([["Cleaning Up...", "green"]], "", false)).start();
    await actions.cleanup();

    spinner.info(Logger.parse([["Initializing Project...", "green"]], "", false)).start();
    await actions.copyExampleEnv();
    await actions.createTsConfig();

    spinner.succeed(Logger.parse([["Project initialization complete!", "green"]], "", false));

    await actions.complete(install);
  }
}
