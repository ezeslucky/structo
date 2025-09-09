
```ts

/// <reference types="node" />

import { ExtractStructoQueryData as __EXPERMIENTAL__ExtractStructoQueryData } from '@structoapp/nextjs-app-router';
import { CodeComponentMeta } from '@structoapp/loader-react';
import { ComponentLookupSpec } from '@structoapp/loader-react';
import { ComponentMeta } from '@structoapp/loader-react/react-server-conditional';
import { ComponentRenderData } from '@structoapp/loader-react/react-server-conditional';
import { CustomFunctionMeta } from '@structoapp/loader-react';
import { DataCtxReader } from '@structoapp/loader-react';
import { DataProvider } from '@structoapp/loader-react';
import { FetchComponentDataOpts as FetchComponentDataOpts_2 } from '@structoapp/loader-react';
import { GlobalActionsContext } from '@structoapp/loader-react';
import { GlobalActionsProvider } from '@structoapp/loader-react';
import { GlobalContextMeta } from '@structoapp/loader-react';
import { IncomingMessage } from 'http';
import { InitOptions } from '@structoapp/loader-react/react-server-conditional';
import { InternalStructoComponentLoader } from '@structoapp/loader-react';
import { PageMeta } from '@structoapp/loader-react/react-server-conditional';
import { PageMetadata } from '@structoapp/loader-react/react-server-conditional';
import { PageParamsProvider } from '@structoapp/loader-react';
import { StructoCanvasContext } from '@structoapp/loader-react';
import { StructoCanvasHost } from '@structoapp/loader-react';
import { StructoComponent } from '@structoapp/loader-react';
import { StructoComponentLoader } from '@structoapp/loader-react';
import { StructoPrepass } from '@structoapp/loader-react';
import { StructoRootProvider as StructoRootProvider_2 } from '@structoapp/loader-react';
import { StructoTranslator } from '@structoapp/loader-react';
import { StructoTranslatorContext } from '@structoapp/loader-react';
import { PropType } from '@structoapp/loader-react';
import * as React_2 from 'react';
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

export { __EXPERMIENTAL__ExtractStructoQueryData }

export { CodeComponentMeta }

export { ComponentMeta }

export { ComponentRenderData }

export { CustomFunctionMeta }

export { DataCtxReader }

export { DataProvider }

// @public
export function extractStructoQueryData(element: React_2.ReactElement): Promise<Record<string, any>>;

// @public (undocumented)
export interface FetchComponentDataOpts extends FetchComponentDataOpts_2 {
    deferChunks?: boolean;
}

export { GlobalActionsContext }

export { GlobalActionsProvider }

export { GlobalContextMeta }

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
    fetchComponentData(...specs: ComponentLookupSpec[]): Promise<ComponentRenderData>;
    // (undocumented)
    fetchComponentData(specs: ComponentLookupSpec[], opts?: FetchComponentDataOpts): Promise<ComponentRenderData>;
    // (undocumented)
    getActiveVariation(opts: {
        req?: ServerRequest;
        res?: ServerResponse;
        known?: Record<string, string>;
        traits: Record<string, string | number | boolean>;
    }): Promise<Record<string, string>>;
    // (undocumented)
    maybeFetchComponentData(specs: ComponentLookupSpec[], opts?: FetchComponentDataOpts): Promise<ComponentRenderData | null>;
    // (undocumented)
    maybeFetchComponentData(...specs: ComponentLookupSpec[]): Promise<ComponentRenderData | null>;
}

export { PageMeta }

export { PageMetadata }

export { PageParamsProvider }

export { StructoCanvasContext }

export { StructoCanvasHost }

export { StructoComponent }

export { StructoPrepass }

// @public (undocumented)
export function StructoRootProvider(props: Omit<React_2.ComponentProps<typeof StructoRootProvider_2>, "Head"> & {
    skipChunks?: boolean;
}): React_2.JSX.Element;

export { StructoTranslator }

export { StructoTranslatorContext }

export { PropType }

export { repeatedElement }

export { TokenRegistration }

export { useDataEnv }

export { useStructoCanvasComponentInfo }

export { useStructoCanvasContext }

export { useStructoComponent }

export { useStructoQueryData }

export { useSelector }

export { useSelectors }

// (No @packageDocumentation comment for this package)

```
