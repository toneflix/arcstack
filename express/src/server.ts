import Application from "src/core/app";
import { detect } from "detect-port";
import express from "express";

detect(3000).then(async (port) => {
  const app = new Application(express());

  await app.boot(port);

  // Handle graceful shutdown
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
    process.on(signal, async () => await app.shutdown());
  });
});
