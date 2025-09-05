import { StructoConfig } from "../utils/config-utils";

export function ensureComponentType(config: StructoConfig) {
  for (const project of config.projects) {
    for (const component of project.components) {
      if (component.componentType) {
        continue;
      }
      const [_, componentPath] = component.importSpec.modulePath.split(/pages/);
      component.componentType = componentPath ? "page" : "component";
    }
  }
  return config;
}
