/** Shared exports for both "default" and "react-server" exports live here. */

export type {
  ComponentMeta,
  PageMeta,
  PageMetadata,
} from "@structoapp/loader-core";
export { convertBundlesToComponentRenderData } from "./bundles";
export type { ComponentRenderData, InitOptions } from "./loader-shared";
export { matchesPagePath } from "./utils";
