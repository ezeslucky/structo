import { InternalStructoComponentLoader } from "./loader-client";
import {
  CodeComponentMeta,
  CustomFunctionMeta,
  FetchComponentDataOpts,
  GlobalContextMeta,
  InitOptions,
  StructoComponentLoader,
} from "./loader-shared";

export {
  DataCtxReader,
  DataProvider,
  GlobalActionsContext,
  GlobalActionsProvider,
  PageParamsProvider,
  StructoCanvasContext,
  StructoCanvasHost,
  StructoTranslatorContext,
  repeatedElement,
  useDataEnv,
  useStructoCanvasComponentInfo,
  useStructoCanvasContext,
  useSelector,
  useSelectors,
} from "@structoapp/host";
export type { PropType, TokenRegistration } from "@structoapp/host";
export { useStructoQueryData } from "@structoapp/query";
export { StructoComponent } from "./StructoComponent";
export { StructoRootProvider } from "./StructoRootProvider";
export type {
  GlobalVariantSpec,
  StructoTranslator,
} from "./StructoRootProvider";
export { extractStructoQueryData, structoPrepass } from "./prepass-client";
export {
  extractStructoQueryDataFromElement,
  hydrateFromElement,
  renderToElement,
  renderToString,
} from "./render";
export * from "./shared-exports";
export { useStructoComponent } from "./useStructoComponent";
export type { ComponentLookupSpec } from "./utils";
export { InternalStructoComponentLoader, StructoComponentLoader };
export type {
  CodeComponentMeta,
  CustomFunctionMeta,
  FetchComponentDataOpts,
  GlobalContextMeta,
};

export function initStructoLoader(opts: InitOptions): StructoComponentLoader {
  const internal = new InternalStructoComponentLoader(opts);
  return new StructoComponentLoader(internal);
}
