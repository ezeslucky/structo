

```ts

import type { HeadMetadata } from '@structoapp/query';

// @public (undocumented)
export function fetchExtractedHeadMetadata(url: string): Promise<HeadMetadata | undefined>;

// @public (undocumented)
export function fetchExtractedQueryData(url: string): Promise<any>;

// @public
export function withStructoMetadata({ pathname, searchParams, }: {
    pathname: string;
    searchParams: Record<string, string | string[]> | undefined;
}): Promise<object>;

// (No @packageDocumentation comment for this package)

```
