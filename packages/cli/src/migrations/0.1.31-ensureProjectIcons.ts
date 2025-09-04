import { StructoConfig } from "../utils/config-utils";

export function ensureProjectIcons(config: StructoConfig) {
  for (const proj of config.projects) {
    if (!proj.icons) {
      proj.icons = [];
    }
  }
  return config;
}
