

```ts

/// <reference types="react" />

import { AssetModule } from '@structoapp/loader-core';
import type { CodeComponentMeta as CodeComponentMeta_2 } from '@structoapp/host';
import { CodeModule } from '@structoapp/loader-fetcher';
import type { ComponentHelpers } from '@structoapp/host';
import { ComponentMeta } from '@structoapp/loader-core';
import { ComponentMeta as ComponentMeta_2 } from '@structoapp/loader-fetcher';
import type { CustomFunctionMeta as CustomFunctionMeta_2 } from '@structoapp/host';
import { DataCtxReader } from '@structoapp/host';
import { DataProvider } from '@structoapp/host';
import { FontMeta } from '@structoapp/loader-core';
import { getActiveVariation } from '@structoapp/loader-splits';
import { getExternalIds } from '@structoapp/loader-splits';
import { GlobalActionsContext } from '@structoapp/host';
import { GlobalActionsProvider } from '@structoapp/host';
import type { GlobalContextMeta as GlobalContextMeta_2 } from '@structoapp/host';
import { GlobalGroupMeta } from '@structoapp/loader-core';
import { LoaderBundleCache } from '@structoapp/loader-core';
import { LoaderBundleOutput } from '@structoapp/loader-fetcher';
import { LoaderBundleOutput as LoaderBundleOutput_2 } from '@structoapp/loader-core';
import { PageMeta } from '@structoapp/loader-core';
import { PageMetadata } from '@structoapp/loader-core';
import { PageParamsProvider } from '@structoapp/host';
import { StructoappDataSourcesContext } from '@structoapp/data-sources-context';
import { StructoappHost } from '@structoapp/host';
import { StructoappQuery } from '@structoapp/query';
import { StructoCanvasContext } from '@structoapp/host';
import { StructoCanvasHost } from '@structoapp/host';
import { StructoDataSourceContextValue } from '@structoapp/data-sources-context';
import { StructoModulesFetcher } from '@structoapp/loader-core';
import { StructoTranslatorContext } from '@structoapp/host';
import { PropType } from '@structoapp/host';
import { react } from 'react';
import * as React_2 from 'react';
import { default as React_3 } from 'react';
import { reactDom } from 'react-dom';
import { reactJsxDevRuntime } from 'react/jsx-dev-runtime';
import { reactJsxRuntime } from 'react/jsx-runtime';
import { Registry } from '@structoapp/loader-core';
import { repeatedElement } from '@structoapp/host';
import { Split } from '@structoapp/loader-fetcher';
import type { StateHelpers } from '@structoapp/host';
import type { StateSpec } from '@structoapp/host';
import { TokenRegistration } from '@structoapp/host';
import { TrackRenderOptions } from '@structoapp/loader-core';
import { TraitMeta } from '@structoapp/host';
import { useDataEnv } from '@structoapp/host';
import type { useMutableStructoQueryData } from '@structoapp/query';
import { useStructoCanvasComponentInfo } from '@structoapp/host';
import { useStructoCanvasContext } from '@structoapp/host';
import { useStructoQueryData } from '@structoapp/query';
import { useSelector } from '@structoapp/host';
import { useSelectors } from '@structoapp/host';

// @public (undocumented)
export type CodeComponentMeta<P> = Omit<CodeComponentMeta_2<P>, "importPath" | "componentHelpers" | "states"> & {
    importPath?: string;
    states?: Record<string, StateSpec<P> & StateHelpers<P, any>>;
    getServerInfo?: (props: P, ops: ReactServerOps) => ServerInfo;
};

// @public (undocumented)
export type ComponentLookupSpec = string | {
    name: string;
    projectId?: string;
    isCode?: boolean;
};

export { ComponentMeta }

// @public (undocumented)
export interface ComponentRenderData {
    // (undocumented)
    bundle: LoaderBundleOutput;
    // (undocumented)
    entryCompMetas: (ComponentMeta_2 & {
        params?: Record<string, string>;
    })[];
    // (undocumented)
    remoteFontUrls: string[];
}

// @public (undocumented)
export const convertBundlesToComponentRenderData: (bundles: LoaderBundleOutput_2[], compMetas: ComponentMeta[]) => ComponentRenderData | null;

// @public (undocumented)
export type CustomFunctionMeta<F extends (...args: any[]) => any> = Omit<CustomFunctionMeta_2<F>, "importPath"> & {
    importPath?: string;
};

export { DataCtxReader }

export { DataProvider }

// @public
export function extractStructoQueryData(element: React.ReactElement): Promise<Record<string, any>>;

// @public (undocumented)
export function extractStructoQueryDataFromElement(loader: StructoComponentLoader, lookup: ComponentLookupSpec, opts?: {
    prefetchedData?: ComponentRenderData;
    componentProps?: any;
    globalVariants?: GlobalVariantSpec[];
    prefetchedQueryData?: Record<string, any>;
}): Promise<Record<string, any>>;

// @public (undocumented)
export interface FetchComponentDataOpts {
    target?: "server" | "browser";
}

export { GlobalActionsContext }

export { GlobalActionsProvider }

// @public (undocumented)
export type GlobalContextMeta<P> = Omit<GlobalContextMeta_2<P>, "importPath"> & {
    importPath?: string;
};

// @public (undocumented)
export interface GlobalVariantSpec {
    // (undocumented)
    name: string;
    // (undocumented)
    projectId?: string;
    // (undocumented)
    value: any;
}

// @public (undocumented)
export function hydrateFromElement(loader: StructoComponentLoader, target: HTMLElement, lookup: ComponentLookupSpec, opts?: {
    prefetchedData?: ComponentRenderData;
    componentProps?: any;
    globalVariants?: GlobalVariantSpec[];
    prefetchedQueryData?: Record<string, any>;
}): Promise<void>;

// @public (undocumented)
export interface InitOptions {
    alwaysFresh?: boolean;
    // (undocumented)
    cache?: LoaderBundleCache;
    // (undocumented)
    host?: string;
    // (undocumented)
    i18n?: {
        keyScheme: "content" | "hash" | "path";
        tagPrefix?: string;
    };
    // @deprecated (undocumented)
    i18nKeyScheme?: "content" | "hash";
    manualRedirect?: boolean;
    nativeFetch?: boolean;
    // (undocumented)
    onClientSideFetch?: "warn" | "error";
    // (undocumented)
    platform?: "react" | "nextjs" | "gatsby";
    // (undocumented)
    platformOptions?: {
        nextjs?: {
            appDir: boolean;
        };
    };
    // (undocumented)
    preview?: boolean;
    // (undocumented)
    projects: {
        id: string;
        token: string;
        version?: string;
    }[];
    skipHead?: boolean;
}

// @public (undocumented)
export function initStructoLoader(opts: InitOptions): StructoComponentLoader;

// @public (undocumented)
export class InternalStructoComponentLoader extends BaseInternalStructoComponentLoader {
    constructor(opts: InitOptions);
    // (undocumented)
    refreshRegistry(): void;
    // (undocumented)
    registerComponent<T extends React_3.ComponentType<any>>(component: T, meta: CodeComponentMeta<React_3.ComponentProps<T>>): void;
    // (undocumented)
    registerFunction<F extends (...args: any[]) => any>(fn: F, meta: CustomFunctionMeta<F>): void;
    // (undocumented)
    registerGlobalContext<T extends React_3.ComponentType<any>>(context: T, meta: GlobalContextMeta<React_3.ComponentProps<T>>): void;
    // (undocumented)
    registerToken(token: TokenRegistration): void;
    // (undocumented)
    registerTrait(trait: string, meta: TraitMeta): void;
    // (undocumented)
    subscribeStructoRoot(watcher: StructoRootWatcher): void;
    // (undocumented)
    unsubscribeStructoRoot(watcher: StructoRootWatcher): void;
}

// @public
export function matchesPagePath(pattern: string, path: string): false | {
    params: Record<string, string | string[]>;
};

export { PageMeta }

export { PageMetadata }

export { PageParamsProvider }

export { StructoCanvasContext }

export { StructoCanvasHost }

// @public (undocumented)
export function StructoComponent(props: {
    component: string;
    projectId?: string;
    forceOriginal?: boolean;
    componentProps?: any;
}): React_2.ReactElement | null;

// @public
export class StructoComponentLoader {
    constructor(internal: BaseInternalStructoComponentLoader);
    // (undocumented)
    clearCache(): void;
    fetchComponentData(...specs: ComponentLookupSpec[]): Promise<ComponentRenderData>;
    // (undocumented)
    fetchComponentData(specs: ComponentLookupSpec[], opts?: FetchComponentDataOpts): Promise<ComponentRenderData>;
    fetchComponents(): Promise<ComponentMeta_2[]>;
    fetchPages(opts?: FetchPagesOpts): Promise<PageMeta[]>;
    // (undocumented)
    getActiveSplits(): Split[];
    // (undocumented)
    getActiveVariation(opts: {
        known?: Record<string, string>;
        traits: Record<string, string | number | boolean>;
    }): Promise<Record<string, string>>;
    // (undocumented)
    protected _getActiveVariation(opts: Parameters<typeof StructoComponentLoader.__internal.getActiveVariation>[0]): Promise<Record<string, string>>;
    // (undocumented)
    getChunksUrl(bundle: LoaderBundleOutput, modules: CodeModule[]): string;
    // (undocumented)
    getExternalVariation(variation: Record<string, string>, filters?: Parameters<typeof getExternalIds>[2]): Record<string, string>;
    maybeFetchComponentData(...specs: ComponentLookupSpec[]): Promise<ComponentRenderData | null>;
    // (undocumented)
    maybeFetchComponentData(specs: ComponentLookupSpec[], opts?: FetchComponentDataOpts): Promise<ComponentRenderData | null>;
    registerComponent<T extends React.ComponentType<any>>(component: T, meta: CodeComponentMeta<React.ComponentProps<T>>): void;
    registerComponent<T extends React.ComponentType<any>>(component: T, name: ComponentLookupSpec): void;
    // (undocumented)
    registerFunction<F extends (...args: any[]) => any>(fn: F, meta: CustomFunctionMeta<F>): void;
    // (undocumented)
    registerGlobalContext<T extends React.ComponentType<any>>(context: T, meta: GlobalContextMeta<React.ComponentProps<T>>): void;
    // (undocumented)
    registerModules(modules: Record<string, any>): void;
    // (undocumented)
    registerToken(token: TokenRegistration): void;
    // (undocumented)
    registerTrait(trait: string, meta: TraitMeta): void;
    setGlobalVariants(globalVariants: GlobalVariantSpec[]): void;
    substituteComponent<P>(component: React.ComponentType<P>, name: ComponentLookupSpec): void;
    // (undocumented)
    trackConversion(value?: number): void;
    // (undocumented)
    unstable__getServerQueriesData(renderData: ComponentRenderData, $ctx: Record<string, any>): Promise<any>;
}

// @public @deprecated (undocumented)
export function structoPrepass(element: React.ReactElement): Promise<void>;

// @public
export function StructoRootProvider(props: {
    loader: StructoComponentLoader;
    globalVariants?: GlobalVariantSpec[];
    children?: React_2.ReactNode;
    skipCss?: boolean;
    skipFonts?: boolean;
    prefetchedData?: ComponentRenderData;
    prefetchedQueryData?: Record<string, any>;
    suspenseForQueryData?: boolean;
    globalContextsProps?: Record<string, any>;
    variation?: Record<string, string>;
    translator?: StructoTranslator;
    Head?: React_2.ComponentType<any>;
    Link?: React_2.ComponentType<any>;
    pageRoute?: string;
    pageParams?: Record<string, string | string[] | undefined>;
    pageQuery?: Record<string, string | string[] | undefined>;
    disableLoadingBoundary?: boolean;
    disableRootLoadingBoundary?: boolean;
    suspenseFallback?: React_2.ReactNode;
} & StructoDataSourceContextValue): React_2.JSX.Element;

// @public (undocumented)
export type StructoTranslator = (str: string, opts?: {
    components?: {
        [key: string]: React_2.ReactElement | React_2.ReactFragment;
    };
}) => React_2.ReactNode;

export { StructoTranslatorContext }

export { PropType }

// @public (undocumented)
export function renderToElement(loader: StructoComponentLoader, target: HTMLElement, lookup: ComponentLookupSpec, opts?: {
    prefetchedData?: ComponentRenderData;
    componentProps?: any;
    globalVariants?: GlobalVariantSpec[];
    prefetchedQueryData?: Record<string, any>;
    pageParams?: Record<string, any>;
    pageQuery?: Record<string, any>;
}): Promise<void>;

// @public (undocumented)
export function renderToString(loader: StructoComponentLoader, lookup: ComponentLookupSpec, opts?: {
    prefetchedData?: ComponentRenderData;
    componentProps?: any;
    globalVariants?: GlobalVariantSpec[];
    prefetchedQueryData?: Record<string, any>;
}): string;

export { repeatedElement }

export { TokenRegistration }

export { useDataEnv }

export { useStructoCanvasComponentInfo }

export { useStructoCanvasContext }

// @public
export function useStructoComponent<P extends React_2.ComponentType = any>(spec: ComponentLookupSpec, opts?: {
    forceOriginal?: boolean;
}): P;

export { useStructoQueryData }

export { useSelector }

export { useSelectors }

// (No @packageDocumentation comment for this package)

```
