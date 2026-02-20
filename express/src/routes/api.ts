import { Router } from "src/core/router";
import UserController from "src/app/http/controllers/UserController";

Router.get("/hello", ({ res }) => {
  res.send("Hello World");
});

Router.apiResource("/users", UserController);
