import { StructoConfig } from "../utils/config-utils";

export function ensureIndirect(config: StructoConfig) {
  for (const p of config.projects) {
    if (p.indirect === undefined) {
      p.indirect = false;
    }
  }
  return config;
}
