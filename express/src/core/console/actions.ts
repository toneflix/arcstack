// oxlint-disable typescript/no-explicit-any

import "src/core/utils/prototypes";

import { dirname, join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

// Base directories (adjust as needed)
const CONTROLLERS_DIR = join(process.cwd(), "src/app/http/controllers");
const RESOURCES_DIR = join(process.cwd(), "src/app/http/resources");
const STUBS_DIR = join(process.cwd(), "src/core/console/stubs");
const STUBS = {
  controller: "controller.stub",
  api: "controller.api.stub",
  model: "controller.model.stub",
  resource: "resource.stub",
  collection: "resource.collection.stub",
  apiResource: "controller.api.resource.stub",
};

/**
 * Utility to ensure directory exists
 *
 * @param filePath
 */
function ensureDirectory(filePath: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Utility to generate file from stub
 *
 * @param stubPath
 * @param outputPath
 * @param replacements
 */
function generateFile(stubPath: string, outputPath: string, replacements: Record<string, string>) {
  if (existsSync(outputPath)) {
    console.error(`Error: ${outputPath} already exists.`);
    process.exit(1);
  }

  let content = readFileSync(stubPath, "utf-8");
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  ensureDirectory(outputPath);
  writeFileSync(outputPath, content);
  console.log(`Created: ${outputPath}`);
}

/**
 * Command to create a new controller file
 *
 * @param name
 * @param options
 */
export const makeController = (name: string, options: any) => {
  name = name.endsWith("Controller") ? name.replace(/controller/i, "") : name;

  const controllerName = name.endsWith("Controller") ? name : `${name}Controller`;
  const fileName = `${controllerName}.ts`;
  const outputPath = join(CONTROLLERS_DIR, fileName);
  const stubPath = join(
    STUBS_DIR,
    options.model ? STUBS.model : options.api ? STUBS.api : STUBS.controller,
  );

  if (!existsSync(stubPath)) {
    console.error(`Error: Stub file ${stubPath} not found.`);
    process.exit(1);
  }

  generateFile(stubPath, outputPath, {
    ControllerName: controllerName,
    ModelName: options.model?.camelCase(),
    Name: controllerName.replace(/controller/i, ""),
  });

  return controllerName;
};

/**
 * Command to create a new resource or resource collection file
 *
 * @param name
 * @param options
 */
export const makeResource = (name: string, options: any) => {
  const resourceName =
    name.endsWith("Resource") || name.endsWith("Collection") ? name : `${name}Resource`;
  const fileName = `${resourceName}.ts`;
  const outputPath = join(RESOURCES_DIR, fileName);
  const stubPath = join(
    STUBS_DIR,
    options.collection || name.endsWith("Collection") ? STUBS.collection : STUBS.resource,
  );

  if (!existsSync(stubPath)) {
    console.error(`Error: Stub file ${stubPath} not found.`);
    process.exit(1);
  }

  generateFile(stubPath, outputPath, {
    ResourceName: resourceName,
    CollectionResourceName: resourceName.replace(/(Resource|Collection)$/, "") + "Resource",
  });

  return resourceName;
};
