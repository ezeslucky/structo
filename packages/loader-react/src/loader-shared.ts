import type {
  ComponentHelpers,
  ComponentHelpers as InternalCodeComponentHelpers,
  CodeComponentMeta as InternalCodeComponentMeta,
  CustomFunctionMeta as InternalCustomFunctionMeta,
  GlobalContextMeta as InternalGlobalContextMeta,
  StateHelpers,
  StateSpec,
  TokenRegistration,
  TraitMeta,
  useDataEnv,
  useSelector,
  useSelectors,
} from "@structoapp/host";
import {
  LoaderBundleCache,
  PageMeta,
  StrutoModulesFetcher,
  Registry,
  TrackRenderOptions,
} from "@structoapp/loader-core";
import {
  CodeModule,
  ComponentMeta,
  LoaderBundleOutput,
  internal_getCachedBundleInNodeServer,
} from "@structoapp/loader-fetcher";
import { getActiveVariation, getExternalIds } from "@structoapp/loader-splits";
import type { useMutableStructoQueryData } from "@structoapp/query";
import type { GlobalVariantSpec } from "./StructoRootProvider";
import { mergeBundles, prepComponentData } from "./bundles";
import { ComponentLookup } from "./component-lookup";
import {
  ComponentLookupSpec,
  getCompMetas,
  getLookupSpecName,
  isBrowser,
  isDynamicPagePath,
  uniq,
} from "./utils";
import { getStructoCookieValues, updateStructoCookieValue } from "./variation";

export interface InitOptions {
  projects: {
    id: string;
    token: string;
    version?: string;
  }[];
  cache?: LoaderBundleCache;
  platform?: "react" | "nextjs" | "gatsby";
  platformOptions?: {
    nextjs?: {
      appDir: boolean;
    };
  };
  preview?: boolean;
  host?: string;
  onClientSideFetch?: "warn" | "error";
  i18n?: {
    keyScheme: "content" | "hash" | "path";
    tagPrefix?: string;
  };
  /**
   * @deprecated use i18n.keyScheme instead
   */
  i18nKeyScheme?: "content" | "hash";

  
  alwaysFresh?: boolean;

 
  skipHead?: boolean;

  
  nativeFetch?: boolean;

 
  manualRedirect?: boolean;
}

export interface ComponentRenderData {
  entryCompMetas: (ComponentMeta & { params?: Record<string, string> })[];
  bundle: LoaderBundleOutput;
  remoteFontUrls: string[];
}

export interface ComponentSubstitutionSpec {
  lookup: ComponentLookupSpec;
  component: React.ComponentType<any>;
  codeComponentHelpers?: InternalCodeComponentHelpers<
    React.ComponentProps<any>
  >;
}

export interface StructoRootWatcher {
  onDataFetched?: () => void;
}

/**
 * Helper functions to describe code component behaviors, in order to allow
 * data extraction in RSC / Next.js App routing.
 */
export interface ReactServerOps {
  readDataEnv: typeof useDataEnv;
  readDataSelector: typeof useSelector;
  readDataSelectors: typeof useSelectors;
  /**
   * The contexts are passed using a key instead of the context provider
   * Notice it cannot access the default context value if none has been provided,
   * since React server components cannot create contexts.
   */
  readContext: (contextKey: string) => any;
  /**
   * Allows data fetching from the code component and caching the result,
   * which will be stored in the `queryCache` returned by
   * `extractstructoQueryData`.
   */
  fetchData: typeof useMutableStructoQueryData;
}

/**
 * Represents data provided by a code component via `DataProvider`
 */
export interface ServerProvidedData {
  name: string;
  data: any;
}


export interface ServerProvidedContext {
  
  contextKey: string;
 
  value: any;
}


export interface ServerChildData {
  providedData?: ServerProvidedData | ServerProvidedData[];
  providedContexts?: ServerProvidedContext | ServerProvidedContext[];
  node: React.ReactNode;
}

export interface ServerInfo {
 
  children?: ServerChildData | ServerChildData[];
  providedData?: ServerProvidedData | ServerProvidedData[];
  providedContexts?: ServerProvidedContext | ServerProvidedContext[];
}

export type CodeComponentMeta<P> = Omit<
  InternalCodeComponentMeta<P>,
  "importPath" | "componentHelpers" | "states"
> & {
 
  importPath?: string;
  
  states?: Record<string, StateSpec<P> & StateHelpers<P, any>>;

  
  getServerInfo?: (props: P, ops: ReactServerOps) => ServerInfo;
};

export type GlobalContextMeta<P> = Omit<
  InternalGlobalContextMeta<P>,
  "importPath"
> & {
 
  importPath?: string;
};

export type CustomFunctionMeta<F extends (...args: any[]) => any> = Omit<
  InternalCustomFunctionMeta<F>,
  "importPath"
> & {
 
  importPath?: string;
};

export type FetchPagesOpts = {
 
  includeDynamicPages?: boolean;
};

export const SUBSTITUTED_COMPONENTS: Record<
  string,
  React.ComponentType<any>
> = {};
export const REGISTERED_CODE_COMPONENT_HELPERS: Record<
  string,
  InternalCodeComponentHelpers<React.ComponentProps<any>>
> = {};
export const SUBSTITUTED_GLOBAL_VARIANT_HOOKS: Record<string, () => any> = {};
export const REGISTERED_CUSTOM_FUNCTIONS: Record<
  string,
  (...args: any[]) => any
> = {};

export function customFunctionImportAlias<F extends (...args: any[]) => any>(
  meta: CustomFunctionMeta<F>
) {
  const customFunctionPrefix = `__fn_`;
  return meta.namespace
    ? `${customFunctionPrefix}${meta.namespace}__${meta.name}`
    : `${customFunctionPrefix}${meta.name}`;
}

export function internalSetRegisteredFunction<
  F extends (...args: any[]) => any
>(fn: F, meta: CustomFunctionMeta<F>) {
  REGISTERED_CUSTOM_FUNCTIONS[customFunctionImportAlias(meta)] = fn;
}

interface BuiltinRegisteredModules {
  react: typeof import("react");
  "react-dom": typeof import("react-dom");
  "react/jsx-runtime": typeof import("react/jsx-runtime");
  "react/jsx-dev-runtime": typeof import("react/jsx-dev-runtime");
  "@structoapp/query": typeof import("@structoapp/query");
  "@structoapp/data-sources-context": typeof import("@structoapp/data-sources-context");
  "@structoapp/host": typeof import("@structoapp/host");
  "@structoapp/loader-runtime-registry": {
    components: Record<string, React.ComponentType<any>>;
    globalVariantHooks: Record<string, () => any>;
    codeComponentHelpers: Record<string, ComponentHelpers<any>>;
    functions: Record<string, (...args: any[]) => any>;
  };
}

export interface FetchComponentDataOpts {
 
  target?: "server" | "browser";
}

function parseFetchComponentDataArgs(
  specs: ComponentLookupSpec[],
  opts?: FetchComponentDataOpts
): { specs: ComponentLookupSpec[]; opts?: FetchComponentDataOpts };
function parseFetchComponentDataArgs(...specs: ComponentLookupSpec[]): {
  specs: ComponentLookupSpec[];
  opts?: FetchComponentDataOpts;
};
function parseFetchComponentDataArgs(...args: any[]) {
  let specs: ComponentLookupSpec[];
  let opts: FetchComponentDataOpts | undefined;
  if (Array.isArray(args[0])) {
    specs = args[0];
    opts = args[1];
  } else {
    specs = args;
    opts = undefined;
  }
  return { specs, opts };
}

/** Subset of loader functionality that works on Client and React Server Components. */
export abstract class BaseInternalStructoComponentLoader {
  public readonly opts: InitOptions;
  private readonly registry = new Registry();
  private readonly fetcher: StructoModulesFetcher;
  private readonly onBundleMerged?: () => void;
  private readonly onBundleFetched?: () => void;
  private globalVariants: GlobalVariantSpec[] = [];
  private subs: ComponentSubstitutionSpec[] = [];

  private bundle: LoaderBundleOutput = {
    modules: {
      browser: [],
      server: [],
    },
    components: [],
    globalGroups: [],
    projects: [],
    activeSplits: [],
    bundleKey: null,
    deferChunksByDefault: false,
    disableRootLoadingBoundaryByDefault: false,
    filteredIds: {},
  };

  constructor(args: {
    opts: InitOptions;
    fetcher: StructoModulesFetcher;
    /** Called after `mergeBundle` (including `fetch` calls). */
    onBundleMerged?: () => void;
    /** Called after any `fetch` calls. */
    onBundleFetched?: () => void;
    builtinModules: BuiltinRegisteredModules;
  }) {
    this.opts = args.opts;
    this.fetcher = args.fetcher;
    this.onBundleMerged = args.onBundleMerged;
    this.onBundleFetched = args.onBundleFetched;
    this.registerModules(args.builtinModules);
  }

  private maybeGetCompMetas(...specs: ComponentLookupSpec[]) {
    const found = new Set<ComponentMeta>();
    const missing: ComponentLookupSpec[] = [];
    for (const spec of specs) {
      const filteredMetas = getCompMetas(this.bundle.components, spec);
      if (filteredMetas.length > 0) {
        filteredMetas.forEach((meta) => found.add(meta));
      } else {
        missing.push(spec);
      }
    }
    return { found: Array.from(found.keys()), missing };
  }

  async maybeFetchComponentData(
    specs: ComponentLookupSpec[],
    opts?: FetchComponentDataOpts
  ): Promise<ComponentRenderData | null>;
  async maybeFetchComponentData(
    ...specs: ComponentLookupSpec[]
  ): Promise<ComponentRenderData | null>;
  async maybeFetchComponentData(
    ...args: any[]
  ): Promise<ComponentRenderData | null> {
    const { specs, opts } = parseFetchComponentDataArgs(...args);
    const returnWithSpecsToFetch = async (
      specsToFetch: ComponentLookupSpec[]
    ) => {
      await this.fetchMissingData({ missingSpecs: specsToFetch });
      const { found: existingMetas2, missing: missingSpecs2 } =
        this.maybeGetCompMetas(...specs);
      if (missingSpecs2.length > 0) {
        return null;
      }

      return prepComponentData(this.bundle, existingMetas2, opts);
    };

    if (this.opts.alwaysFresh) {
      // If alwaysFresh, then we treat all specs as missing
      return await returnWithSpecsToFetch(specs);
    }

    // Else we only fetch actually missing specs
    const { found: existingMetas, missing: missingSpecs } =
      this.maybeGetCompMetas(...specs);
    if (missingSpecs.length === 0) {
      return prepComponentData(this.bundle, existingMetas, opts);
    }

    return await returnWithSpecsToFetch(missingSpecs);
  }

  async fetchComponentData(
    specs: ComponentLookupSpec[],
    opts?: FetchComponentDataOpts
  ): Promise<ComponentRenderData>;
  async fetchComponentData(
    ...specs: ComponentLookupSpec[]
  ): Promise<ComponentRenderData>;
  async fetchComponentData(...args: any[]): Promise<ComponentRenderData> {
    const { specs, opts } = parseFetchComponentDataArgs(...args);
    const data = await this.maybeFetchComponentData(specs, opts);

    if (!data) {
      const { missing: missingSpecs } = this.maybeGetCompMetas(...specs);
      throw new Error(
        `Unable to find components ${missingSpecs
          .map(getLookupSpecName)
          .join(", ")}`
      );
    }

    return data;
  }

  async fetchPages(opts?: FetchPagesOpts) {
    this.maybeReportClientSideFetch(
      () => `Structo: fetching all page metadata in the browser`
    );
    const data = await this.fetchAllData();
    return data.components.filter(
      (comp) =>
        comp.isPage &&
        comp.path &&
        (opts?.includeDynamicPages || !isDynamicPagePath(comp.path))
    ) as PageMeta[];
  }

  async fetchComponents() {
    this.maybeReportClientSideFetch(
      () => `Structo: fetching all component metadata in the browser`
    );
    const data = await this.fetchAllData();
    return data.components;
  }

  getActiveSplits() {
    return this.bundle.activeSplits;
  }

  getChunksUrl(bundle: LoaderBundleOutput, modules: CodeModule[]) {
    return this.fetcher.getChunksUrl(bundle, modules);
  }

  private async fetchMissingData(opts: {
    missingSpecs: ComponentLookupSpec[];
  }) {
    // TODO: do better than just fetching everything
    this.maybeReportClientSideFetch(
      () =>
        `Structo: fetching missing components in the browser: ${opts.missingSpecs
          .map((spec) => getLookupSpecName(spec))
          .join(", ")}`
    );
    return this.fetchAllData();
  }

  private maybeReportClientSideFetch(mkMsg: () => string) {
    if (isBrowser && this.opts.onClientSideFetch) {
      const msg = mkMsg();
      if (this.opts.onClientSideFetch === "warn") {
        console.warn(msg);
      } else {
        throw new Error(msg);
      }
    }
  }

  private async fetchAllData() {
    const bundle = await this.fetcher.fetchAllData();
    this.mergeBundle(bundle);
    this.onBundleFetched?.();
    return bundle;
  }

  mergeBundle(newBundle: LoaderBundleOutput) {
    newBundle.bundleKey = newBundle.bundleKey ?? null;
    if (
      newBundle.bundleKey &&
      this.bundle.bundleKey &&
      newBundle.bundleKey !== this.bundle.bundleKey
    ) {
      console.warn(
        `Structo Error: Different code export hashes. This can happen if your app is using different loaders with different project IDs or project versions.
Conflicting values:
${newBundle.bundleKey}
${this.bundle.bundleKey}`
      );
    }
    // Merge the old bundle into the new bundle, this way
    // the new bundle will enforce the latest data from the server
    // allowing elements to be deleted by newer bundles
    this.bundle = mergeBundles(newBundle, this.bundle);

    this.onBundleMerged?.();
  }

  getBundle(): LoaderBundleOutput {
    return this.bundle;
  }

  clearCache() {
    this.bundle = {
      modules: {
        browser: [],
        server: [],
      },
      components: [],
      globalGroups: [],
      projects: [],
      activeSplits: [],
      bundleKey: null,
      deferChunksByDefault: false,
      disableRootLoadingBoundaryByDefault: false,
      filteredIds: {},
    };
    this.registry.clear();
  }

  registerModules(modules: Record<string, any>) {
    if (
      Object.keys(modules).some(
        (name) => this.registry.getRegisteredModule(name) !== modules[name]
      )
    ) {
      if (!this.registry.isEmpty()) {
        console.warn(
          "Calling StructoComponentLoader.registerModules() after Structo component has rendered; starting over."
        );
        this.registry.clear();
      }
      for (const key of Object.keys(modules)) {
        this.registry.register(key, modules[key]);
      }
    }
  }

  substituteComponent<P>(
    component: React.ComponentType<P>,
    name: ComponentLookupSpec
  ) {
    this.internalSubstituteComponent(component, name, undefined);
  }

  protected internalSubstituteComponent<P>(
    component: React.ComponentType<P>,
    name: ComponentLookupSpec,
    codeComponentHelpers:
      | InternalCodeComponentHelpers<
          React.ComponentProps<React.ComponentType<P>>
        >
      | undefined
  ) {
    if (!this.isRegistryEmpty()) {
      console.warn(
        "Calling StructoComponentLoader.registerSubstitution() after Structo component has rendered; starting over."
      );
      this.clearRegistry();
    }
    this.subs.push({ lookup: name, component, codeComponentHelpers });
  }

  abstract registerComponent<T extends React.ComponentType<any>>(
    component: T,
    meta: CodeComponentMeta<React.ComponentProps<T>>
  ): void;
  abstract registerFunction<F extends (...args: any[]) => any>(
    fn: F,
    meta: CustomFunctionMeta<F>
  ): void;
  abstract registerGlobalContext<T extends React.ComponentType<any>>(
    context: T,
    meta: GlobalContextMeta<React.ComponentProps<T>>
  ): void;
  abstract registerTrait(trait: string, meta: TraitMeta): void;
  abstract registerToken(token: TokenRegistration): void;

  protected refreshRegistry() {
    // Once we have received data, we register components to
    // substitute.  We had to wait for data to do this so
    // that we can look up the right module name to substitute
    // in component meta.
    for (const sub of this.subs) {
      const metas = getCompMetas(this.getBundle().components, sub.lookup);
      metas.forEach((meta) => {
        SUBSTITUTED_COMPONENTS[meta.id] = sub.component;
        if (sub.codeComponentHelpers) {
          REGISTERED_CODE_COMPONENT_HELPERS[meta.id] = sub.codeComponentHelpers;
        }
      });
    }

    this.registry.updateModules(this.getBundle());
  }

  isRegistryEmpty() {
    return this.registry.isEmpty();
  }

  clearRegistry() {
    this.registry.clear();
  }

  setGlobalVariants(globalVariants: GlobalVariantSpec[]) {
    this.globalVariants = globalVariants;
  }

  getGlobalVariants() {
    return this.globalVariants;
  }

  registerPrefetchedBundle(bundle: LoaderBundleOutput) {
    
    if (!isBrowser) {
      // Check if we have a cached bundle on this Node server.
      const cachedBundle = internal_getCachedBundleInNodeServer(this.opts);
      if (cachedBundle) {
        // If it's there, merge the cached bundle first.
        this.mergeBundle(cachedBundle);
      }
    }
    this.mergeBundle(bundle);
  }

  getLookup() {
    return new ComponentLookup(this.getBundle(), this.registry);
  }

  trackConversion(_value = 0) {
    // no-op: tracking removed from loader packages
  }

  public async getActiveVariation(
    opts: Omit<Parameters<typeof getActiveVariation>[0], "splits">
  ) {
    await this.fetchComponents();
    return getActiveVariation({
      ...opts,
      splits: this.getBundle().activeSplits,
    });
  }

  public getTeamIds(): string[] {
    return uniq(
      this.getBundle()
        .projects.map((p) =>
          p.teamId ? `${p.teamId}${p.indirect ? "@indirect" : ""}` : null
        )
        .filter((x): x is string => !!x)
    );
  }

  public getProjectIds(): string[] {
    return uniq(
      this.getBundle().projects.map(
        (p) => `${p.id}${p.indirect ? "@indirect" : ""}`
      )
    );
  }

  public trackRender(_opts?: TrackRenderOptions) {
    // no-op: tracking removed from loader packages
  }

  public loadServerQueriesModule(fileName: string) {
    return this.registry.load(fileName);
  }
}

/**
 * Library for fetching component data, and registering
 * custom components.
 */
export class StructoComponentLoader {
  private __internal: BaseInternalStructoComponentLoader;

  constructor(internal: BaseInternalStructoComponentLoader) {
    this.__internal = internal;
  }

  
  setGlobalVariants(globalVariants: GlobalVariantSpec[]) {
    this.__internal.setGlobalVariants(globalVariants);
  }

  registerModules(modules: Record<string, any>) {
    this.__internal.registerModules(modules);
  }

  
  substituteComponent<P>(
    component: React.ComponentType<P>,
    name: ComponentLookupSpec
  ) {
    this.__internal.substituteComponent(component, name);
  }

  /**
   * Register code components to be used on structo Editor.
   */
  registerComponent<T extends React.ComponentType<any>>(
    component: T,
    meta: CodeComponentMeta<React.ComponentProps<T>>
  ): void;

 
  registerComponent<T extends React.ComponentType<any>>(
    component: T,
    name: ComponentLookupSpec
  ): void;

  registerComponent<T extends React.ComponentType<any>>(
    component: T,
    metaOrName: ComponentLookupSpec | CodeComponentMeta<React.ComponentProps<T>>
  ) {
    // 'props' is a required field in CodeComponentMeta
    if (metaOrName && typeof metaOrName === "object" && "props" in metaOrName) {
      this.__internal.registerComponent(component, metaOrName);
    } else {
      // Deprecated call
      if (
        process.env.NODE_ENV === "development" &&
        !this.warnedRegisterComponent
      ) {
        console.warn(
          `StructoLoader: Using deprecated method \`registerComponent\` for component substitution. ` +
            `Please consider using \`substituteComponent\` instead.`
        );
        this.warnedRegisterComponent = true;
      }
      this.substituteComponent(component, metaOrName);
    }
  }
  private warnedRegisterComponent = false;

  registerFunction<F extends (...args: any[]) => any>(
    fn: F,
    meta: CustomFunctionMeta<F>
  ) {
    this.__internal.registerFunction(fn, meta);
  }

  registerGlobalContext<T extends React.ComponentType<any>>(
    context: T,
    meta: GlobalContextMeta<React.ComponentProps<T>>
  ) {
    this.__internal.registerGlobalContext(context, meta);
  }

  registerTrait(trait: string, meta: TraitMeta) {
    this.__internal.registerTrait(trait, meta);
  }

  registerToken(token: TokenRegistration) {
    this.__internal.registerToken(token);
  }

 
  fetchComponentData(
    ...specs: ComponentLookupSpec[]
  ): Promise<ComponentRenderData>;
  fetchComponentData(
    specs: ComponentLookupSpec[],
    opts?: FetchComponentDataOpts
  ): Promise<ComponentRenderData>;
  fetchComponentData(...args: any[]): Promise<ComponentRenderData> {
    return this.__internal.fetchComponentData(...args);
  }

  
  async maybeFetchComponentData(
    ...specs: ComponentLookupSpec[]
  ): Promise<ComponentRenderData | null>;
  async maybeFetchComponentData(
    specs: ComponentLookupSpec[],
    opts?: FetchComponentDataOpts
  ): Promise<ComponentRenderData | null>;
  async maybeFetchComponentData(
    ...args: any[]
  ): Promise<ComponentRenderData | null> {
    return this.__internal.maybeFetchComponentData(...args);
  }

  /**
   * Returns all the page component metadata for these projects.
   */
  async fetchPages(opts?: FetchPagesOpts) {
    return this.__internal.fetchPages(opts);
  }

  /**
   * Returns all components metadata for these projects.
   */
  async fetchComponents() {
    return this.__internal.fetchComponents();
  }

  protected async _getActiveVariation(
    opts: Parameters<typeof this.__internal.getActiveVariation>[0]
  ) {
    return this.__internal.getActiveVariation(opts);
  }

  async getActiveVariation(opts: {
    known?: Record<string, string>;
    traits: Record<string, string | number | boolean>;
  }) {
    return this._getActiveVariation({
      traits: opts.traits,
      getKnownValue: (key: string) => {
        if (opts.known) {
          return opts.known[key];
        } else {
          const cookies = getStructoCookieValues();
          return cookies[key];
        }
      },
      updateKnownValue: (key: string, value: string) => {
        if (!opts.known) {
          updateStructoCookieValue(key, value);
        }
      },
    });
  }

  getChunksUrl(bundle: LoaderBundleOutput, modules: CodeModule[]) {
    return this.__internal.getChunksUrl(bundle, modules);
  }

  getExternalVariation(
    variation: Record<string, string>,
    filters?: Parameters<typeof getExternalIds>[2]
  ) {
    return getExternalIds(this.getActiveSplits(), variation, filters);
  }

  getActiveSplits() {
    return this.__internal.getActiveSplits();
  }

  trackConversion(value = 0) {
    this.__internal.trackConversion(value);
  }

  clearCache() {
    return this.__internal.clearCache();
  }

  async unstable__getServerQueriesData(
    renderData: ComponentRenderData,
    $ctx: Record<string, any>
  ) {
    if (renderData.entryCompMetas.length === 0) {
      return {};
    }

    const fileName = renderData.entryCompMetas[0].serverQueriesExecFuncFileName;

    if (!fileName) {
      return {};
    }

    const module = this.__internal.loadServerQueriesModule(fileName);
    const { executeServerQueries } = module;

    try {
      const $serverQueries = await executeServerQueries($ctx);
      return $serverQueries;
    } catch (err) {
      console.error("Error executing server queries function", err);
      return {};
    }
  }
}
