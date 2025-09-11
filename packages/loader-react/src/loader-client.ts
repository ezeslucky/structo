import * as StructoDataSourcesContext from "@structoapp/data-sources-context";
// eslint-disable-next-line no-restricted-imports
import * as StructoHost from "@structoapp/host";
import {
  // eslint-disable-next-line no-restricted-imports
  registerComponent,
  registerFunction,
  registerGlobalContext,
  registerToken,
  registerTrait,
  stateHelpersKeys,
  TokenRegistration,
  TraitMeta,
} from "@structoapp/host";
import { StructoModulesFetcher } from "@structoapp/loader-core";
import * as StructoQuery from "@structoapp/query";
import React from "react";
import ReactDOM from "react-dom";
import * as jsxDevRuntime from "react/jsx-dev-runtime";
import * as jsxRuntime from "react/jsx-runtime";
import { createUseGlobalVariant } from "./global-variants";
import {
  BaseInternalStructoComponentLoader,
  CodeComponentMeta,
  CustomFunctionMeta,
  GlobalContextMeta,
  InitOptions,
  internalSetRegisteredFunction,
  StructoRootWatcher,
  REGISTERED_CODE_COMPONENT_HELPERS,
  REGISTERED_CUSTOM_FUNCTIONS,
  SUBSTITUTED_COMPONENTS,
  SUBSTITUTED_GLOBAL_VARIANT_HOOKS,
} from "./loader-shared";

export class InternalStructoComponentLoader extends BaseInternalStructoComponentLoader {
  private readonly roots: StructoRootWatcher[] = [];

  constructor(opts: InitOptions) {
    super({
      opts,
      fetcher: new StructoModulesFetcher(opts),
      onBundleMerged: () => {
        this.refreshRegistry();
      },
      onBundleFetched: () => {
        this.roots.forEach((watcher) => watcher.onDataFetched?.());
      },
      builtinModules: {
        react: React,
        "react-dom": ReactDOM,
        "react/jsx-runtime": jsxRuntime,
        "react/jsx-dev-runtime": jsxDevRuntime,

        "@structoapp/query": StructoQuery,
        "@structoapp/data-sources-context": StructoDataSourcesContext,
        "@structoapp/host": StructoHost,
        "@structoapp/loader-runtime-registry": {
          components: SUBSTITUTED_COMPONENTS,
          globalVariantHooks: SUBSTITUTED_GLOBAL_VARIANT_HOOKS,
          codeComponentHelpers: REGISTERED_CODE_COMPONENT_HELPERS,
          functions: REGISTERED_CUSTOM_FUNCTIONS,
        },
      },
    });
  }

  registerComponent<T extends React.ComponentType<any>>(
    component: T,
    meta: CodeComponentMeta<React.ComponentProps<T>>
  ) {
    // making the component meta consistent between codegen and loader
    const stateHelpers = Object.fromEntries(
      Object.entries(meta.states ?? {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, stateSpec]) =>
          Object.keys(stateSpec).some((key) => stateHelpersKeys.includes(key))
        )
        .map(([stateName, stateSpec]) => [
          stateName,
          Object.fromEntries(
            stateHelpersKeys
              .filter((key) => key in stateSpec)
              .map((key) => [key, stateSpec[key]])
          ),
        ])
    );
    const helpers = { states: stateHelpers };
    this.internalSubstituteComponent(
      component,
      { name: meta.name, isCode: true },
      Object.keys(stateHelpers).length > 0 ? helpers : undefined
    );
    registerComponent(component, {
      ...meta,
      // Import path is not used as we will use component substitution
      importPath: meta.importPath ?? "",
      ...(Object.keys(stateHelpers).length > 0
        ? {
            componentHelpers: {
              helpers,
              importPath: "",
              importName: "",
            },
          }
        : {}),
    });
  }

  registerFunction<F extends (...args: any[]) => any>(
    fn: F,
    meta: CustomFunctionMeta<F>
  ) {
    registerFunction(fn, {
      ...meta,
      importPath: meta.importPath ?? "",
    });
    internalSetRegisteredFunction(fn, meta);
  }

  registerGlobalContext<T extends React.ComponentType<any>>(
    context: T,
    meta: GlobalContextMeta<React.ComponentProps<T>>
  ) {
    this.substituteComponent(context, { name: meta.name, isCode: true });
    // Import path is not used as we will use component substitution
    registerGlobalContext(context, {
      ...meta,
      importPath: meta.importPath ?? "",
    });
  }

  registerTrait(trait: string, meta: TraitMeta) {
    registerTrait(trait, meta);
  }

  registerToken(token: TokenRegistration) {
    registerToken(token);
  }

  subscribeStructoRoot(watcher: StructoRootWatcher) {
    this.roots.push(watcher);
  }

  unsubscribeStructoRoot(watcher: StructoRootWatcher) {
    const index = this.roots.indexOf(watcher);
    if (index >= 0) {
      this.roots.splice(index, 1);
    }
  }

  refreshRegistry() {
    
    for (const globalGroup of this.getBundle().globalGroups) {
      if (globalGroup.type !== "global-screen") {
        SUBSTITUTED_GLOBAL_VARIANT_HOOKS[globalGroup.id] =
          createUseGlobalVariant(globalGroup.name, globalGroup.projectId);
      }
    }
    super.refreshRegistry();
  }
}
