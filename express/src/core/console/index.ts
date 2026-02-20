#!/usr/bin/env

import { App } from "./app";
import { Kernel } from "@h3ravel/musket";
import { app } from "../bootstrap";
import path from "node:path";

await Kernel.init(await new App(app).loadConfig(), {
  name: "Cmd",
  discoveryPaths: [path.join(process.cwd(), "src/core/console/commands/*.ts")],
  exceptionHandler(exception) {
    throw exception;
  },
});
