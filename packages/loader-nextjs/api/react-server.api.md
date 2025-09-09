

```ts

/// <reference types="node" />

import { fetchExtractedHeadMetadata as __EXPERMIENTAL__fetchExtractedHeadMetadata } from '@structoapp/nextjs-app-router/react-server';
import { fetchExtractedQueryData as __EXPERMIENTAL__fetchExtractedQueryData } from '@structoapp/nextjs-app-router/react-server';
import { withStructoMetadata as __EXPERMIENTAL__withStructoMetadata } from '@structoapp/nextjs-app-router/react-server';
import { CodeComponentMeta } from '@structoapp/loader-react';
import { ComponentLookupSpec } from '@structoapp/loader-react';
import { ComponentMeta } from '@structoapp/loader-react/react-server-conditional';
import { ComponentRenderData } from '@structoapp/loader-react/react-server-conditional';
import { CustomFunctionMeta } from '@structoapp/loader-react';
import { DataCtxReader } from '@structoapp/loader-react';
import { DataProvider } from '@structoapp/loader-react';
import { ExtractStructoQueryData } from '@structoapp/nextjs-app-router';
import { FetchComponentDataOpts as FetchComponentDataOpts_2 } from '@structoapp/loader-react';
import { GlobalActionsContext } from '@structoapp/loader-react';
import { GlobalActionsProvider } from '@structoapp/loader-react';
import { GlobalContextMeta } from '@structoapp/loader-react';
import { IncomingMessage } from 'http';
import { InitOptions } from '@structoapp/loader-react/react-server-conditional';
import { InternalStructoComponentLoader } from '@structoapp/loader-react/react-server';
import { InternalStructoComponentLoader as InternalStructoComponentLoader_2 } from '@structoapp/loader-react';
import { PageMeta } from '@structoapp/loader-react/react-server-conditional';
import { PageMetadata } from '@structoapp/loader-react/react-server-conditional';
import { PageParamsProvider } from '@structoapp/loader-react';
import { StructoCanvasContext } from '@structoapp/loader-react';
import { StructoCanvasHost } from '@structoapp/loader-react';
import { StructoComponent } from '@structoapp/loader-react';
import { StructoComponentLoader } from '@structoapp/loader-react/react-server';
import { StructoComponentLoader as StructoComponentLoader_2 } from '@structoapp/loader-react';
import { StructoPrepass } from '@structoapp/loader-react';
import { StructoRootProvider as StructoRootProvider_2 } from '@structoapp/loader-react';
import { StructoTranslator } from '@structoapp/loader-react';
import { StructoTranslatorContext } from '@structoapp/loader-react';
import { PropType } from '@structoapp/loader-react';
import { default as React_2 } from 'react';
import * as React_3 from 'react';
import { repeatedElement } from '@structoapp/loader-react';
import { ServerResponse } from 'http';
import { TokenRegistration } from '@structoapp/loader-react';
import { useDataEnv } from '@structoapp/loader-react';
import { useStructoCanvasComponentInfo } from '@structoapp/loader-react';
import { useStructoCanvasContext } from '@structoapp/loader-react';
import { useStructoComponent } from '@structoapp/loader-react';
import { useStructoQueryData } from '@structoapp/loader-react';
import { useSelector } from '@structoapp/loader-react';
import { useSelectors } from '@structoapp/loader-react';

// @public (undocumented)
export const __EXPERMIENTAL__extractStructoQueryData: (element: React_2.ReactElement, loader: ClientExports.NextJsStructoComponentLoader) => Promise<Record<string, any>>;

export { __EXPERMIENTAL__fetchExtractedHeadMetadata }

export { __EXPERMIENTAL__fetchExtractedQueryData }

// @public
export function __EXPERMIENTAL__withExtractStructoQueryData(structoRootProvider: React_2.ReactElement, { pathname, searchParams, }: {
    pathname: string;
    searchParams: Record<string, string | string[]> | undefined;
}): Promise<React_2.JSX.Element>;

export { __EXPERMIENTAL__withStructoMetadata }

export { ComponentMeta }

export { ComponentRenderData }

export { InitOptions }

// @public (undocumented)
export function initStructoLoader(opts: NextInitOptions): NextJsStructoComponentLoader;

// @public (undocumented)
export interface NextInitOptions extends InitOptions {
    nextNavigation?: {
        notFound: unknown;
        redirect: unknown;
        useParams: unknown;
        usePathname: unknown;
        useRouter: unknown;
        useSearchParams: unknown;
    };
}

// @public (undocumented)
export class NextJsStructoComponentLoader extends StructoComponentLoader {
    constructor(internal: InternalStructoComponentLoader);
    // (undocumented)
    getActiveVariation(opts: {
        req?: ServerRequest;
        res?: ServerResponse;
        known?: Record<string, string>;
        traits: Record<string, string | number | boolean>;
    }): Promise<Record<string, string>>;
}

export { PageMeta }

export { PageMetadata }

// (No @packageDocumentation comment for this package)

```
