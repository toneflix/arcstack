import type { Handler } from "express";

export interface MiddlewareConfig {
  global: Handler[];
  before: Handler[];
  after: Handler[];
}
