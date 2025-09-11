

```ts

/// <reference types="react" />

import { AssetModule } from '@structoapp/loader-core';
import type { CodeComponentMeta as CodeComponentMeta_2 } from '@structoapp/host';
import { CodeModule } from '@structoapp/loader-fetcher';
import type { ComponentHelpers } from '@structoapp/host';
import { ComponentMeta } from '@structoapp/loader-core';
import { ComponentMeta as ComponentMeta_2 } from '@structoapp/loader-fetcher';
import type { CustomFunctionMeta as CustomFunctionMeta_2 } from '@structoapp/host';
import { FontMeta } from '@structoapp/loader-core';
import { getActiveVariation } from '@structoapp/loader-splits';
import { getExternalIds } from '@structoapp/loader-splits';
import type { GlobalContextMeta as GlobalContextMeta_2 } from '@structoapp/host';
import { GlobalGroupMeta } from '@structoapp/loader-core';
import { LoaderBundleCache } from '@structoapp/loader-core';
import { LoaderBundleOutput } from '@structoapp/loader-fetcher';
import { LoaderBundleOutput as LoaderBundleOutput_2 } from '@structoapp/loader-core';
import { PageMeta } from '@structoapp/loader-core';
import { PageMetadata } from '@structoapp/loader-core';
import { structoappDataSourcesContext } from '@structoapp/data-sources-context';
import { structoappHost } from '@structoapp/host';
import { structoappQuery } from '@structoapp/query';
import { StructoModulesFetcher } from '@structoapp/loader-core';
import { react } from 'react';
import * as React_2 from 'react';
import { default as React_3 } from 'react';
import { reactDom } from 'react-dom';
import { reactJsxDevRuntime } from 'react/jsx-dev-runtime';
import { reactJsxRuntime } from 'react/jsx-runtime';
import { Registry } from '@structoapp/loader-core';
import { Split } from '@structoapp/loader-fetcher';
import type { StateHelpers } from '@structoapp/host';
import type { StateSpec } from '@structoapp/host';
import type { TokenRegistration } from '@structoapp/host';
import { TrackRenderOptions } from '@structoapp/loader-core';
import type { TraitMeta } from '@structoapp/host';
import type { useDataEnv } from '@structoapp/host';
import type { useMutableStructoQueryData } from '@structoapp/query';
import type { useSelector } from '@structoapp/host';
import type { useSelectors } from '@structoapp/host';

// @public
export function __EXPERMIENTAL__extractStructoQueryData(element: React.ReactElement, loader: StructoComponentLoader): Promise<Record<string, any>>;

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
    registerToken: (token: TokenRegistration) => void;
    // (undocumented)
    registerTrait: (trait: string, meta: TraitMeta) => void;
}

// @public
export function matchesPagePath(pattern: string, path: string): false | {
    params: Record<string, string | string[]>;
};

export { PageMeta }

export { PageMetadata }

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

// (No @packageDocumentation comment for this package)

```
