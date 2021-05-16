import { App } from "@vue/runtime-core";

const components = import.meta.globEager("./*\.vue")

const install = function(app: App, option: any) {
  Object.entries(components).forEach(([path, inst]) => {
    app.component(inst.default.name, inst.default);
  })
}

export default {
  install,
}
