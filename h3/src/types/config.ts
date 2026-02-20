import { Middleware as IMiddleware } from "clear-router/types/h3";

type Middleware = IMiddleware | [IMiddleware, Record<string, any>];

export interface MiddlewareConfig {
  global: Middleware[];
  before: Middleware[];
  after: Middleware[];
}
