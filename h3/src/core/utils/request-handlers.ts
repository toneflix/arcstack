import { H3Event, HTTPError } from "h3";
// oxlint-disable typescript/no-explicit-any
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

import { Prisma } from "@prisma/client";
import { env } from "./helpers";
import path from "node:path";

export const ErrorHandler = (err: HTTPError, _event: H3Event) => {
  const cause: Error | undefined = err.cause as Error;
  const logsDir = path.resolve(process.cwd(), "storage/logs");
  const message = "Something went wrong";
  let logContent = "";

  const error: Record<string, any> = {
    status: "error",
    code: typeof err === "string" || !err.status ? 500 : err.status,
    message: typeof err === "string" ? `${message}: ${err}` : err.message || message,
  };

  if (typeof err !== "string" && err.stack) {
    error.errors = err.stack;
  }

  if (cause instanceof Prisma.PrismaClientKnownRequestError && cause.code === "P2025") {
    error.code = 404;
    error.message = `${cause.meta?.modelName} not found!`;
  }

  if (
    typeof err !== "string" &&
    env("NODE_ENV") === "development" &&
    env<boolean>("HIDE_ERROR_STACK") !== true
  ) {
    error.stack = err.stack;
  }

  try {
    mkdirSync(logsDir, { recursive: true });
    logContent = readFileSync(path.join(logsDir, "error.log"), "utf-8");
  } catch {
    /** */
  }

  const newLogEntry = `[${new Date().toISOString()}] ${typeof err === "string" ? err : err.stack || err.message}\n\n`;
  writeFileSync(path.join(logsDir, "error.log"), logContent + newLogEntry, "utf-8");

  return {
    ...err,
    error: true,
    message: error.message,
  };
};

export default ErrorHandler;
