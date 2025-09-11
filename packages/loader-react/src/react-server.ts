import "server-only";

import { InternalPrepassStructoLoader } from "./loader-server";
import { InitOptions, StructoComponentLoader } from "./loader-shared";

export { extractStructoQueryData as __EXPERMIENTAL__extractStructoQueryData } from "./prepass-server";
export * from "./shared-exports";
export {
  InternalPrepassStructoLoader as InternalStructoComponentLoader,
  StructoComponentLoader,
};

export function initStructoLoader(opts: InitOptions): StructoComponentLoader {
  const internal = new InternalPrepassStructoLoader(opts);
  return new StructoComponentLoader(internal);
}
