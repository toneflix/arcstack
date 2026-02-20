import { Router } from "src/core/router";
import UserController from "src/app/http/controllers/UserController";

Router.get("/hello", () => {
  return "Hello World";
});

Router.apiResource("/users", UserController);
