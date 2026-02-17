import Application from "src/core/app";
import ErrorHandler from "./utils/request-handlers";
import { H3 } from "h3";

export const app = new Application(
  new H3({
    onError: ErrorHandler,
  }),
); 