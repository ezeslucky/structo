

```ts

import registerFunction from '@structoapp/host/registerFunction';

// @public (undocumented)
function fetch_2(url: string, method: HTTPMethod, headers: Record<string, string>, body?: string | object): Promise<{
    statusCode: number;
    headers: {
        [k: string]: string;
    };
    body: any;
}>;
export { fetch_2 as fetch }

// @public (undocumented)
export function registerFetch(loader?: Registerable): void;

// (No @packageDocumentation comment for this package)

```
