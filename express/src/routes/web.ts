import { Router } from "src/core/router";

Router.get("/", ({ res }) => {
  res.send("Hello World");
});
