#!/usr/bin/env node

import { CreateArcstackCommand } from "./Commands/CreateArcstackCommand";
import { Kernel } from "@h3ravel/musket";

class Application {}

Kernel.init(new Application(), {
  rootCommand: CreateArcstackCommand,
});
