#!/usr/bin/env node

import { CreateToneflixNodejsCommand } from "./Commands/CreateToneflixNodejsCommand";
import { Kernel } from "@h3ravel/musket";

class Application {}

Kernel.init(new Application(), {
  rootCommand: CreateToneflixNodejsCommand,
});
