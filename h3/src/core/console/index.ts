#!/usr/bin/env ts-node

import { Kernel } from "@h3ravel/musket";
import { app } from "../bootstrap";
import path from "node:path";

await Kernel.init(app, {
  name: "Cmd",
  discoveryPaths: [path.join(process.cwd(), "src/core/console/commands/*.ts")],
});
