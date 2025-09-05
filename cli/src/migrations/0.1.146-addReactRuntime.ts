import { StructoConfig } from "../utils/config-utils";

export function ensureReactRuntime(config: StructoConfig) {
  if (!config.code.reactRuntime) {
    config.code.reactRuntime = "classic";
  }
  return config;
}
