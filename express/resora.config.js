import { defineConfig } from 'resora'

export default defineConfig({
  resourcesDir: 'src/app/http/resources',
  stubs: {
    controller: "controller.stub",
    api: "controller.api.stub",
    model: "controller.model.stub",
    apiResource: "controller.api.resource.stub",
  }
})