import { StructoConfig } from "../utils/config-utils";

export function ensureVersion(config: StructoConfig) {
  for (const proj of config.projects) {
    if (!proj.version) {
      proj.version = "latest";
    }
  }
  return config;
}
