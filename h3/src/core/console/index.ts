#!/usr/bin/env

import { App } from "./app";
import { Kernel } from "@h3ravel/musket";
import { app } from "../bootstrap";
import path from "node:path";

await Kernel.init(await new App(app).loadConfig(), {
  name: "Cmd",
  logo: String.raw`                        _             _    
     /\                | |           | |   
    /  \   _ __ ___ ___| |_ __ _  ___| | __
   / /\ \ | '__/ __/ __| __/ _' |/ __| |/ /
  / ____ \| | | (__\__ \ || (_| | (__|   < 
 /_/    \_\_|  \___|___/\__\__,_|\___|_|\_\
  `,
  discoveryPaths: [path.join(process.cwd(), "src/core/console/commands/*.ts")],
  exceptionHandler(exception) {
    throw exception;
  },
});
