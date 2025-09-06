

```ts

import { StructoUser } from '@structoapp/auth-api';

// @public
export function useStructoAuth(opts: {
    host?: string;
    appId?: string;
}): {
    user: StructoUser | null;
    token: string | null;
    isUserLoading: boolean | undefined;
};


export * from "@structoapp/auth-api";

// (No @packageDocumentation comment for this package)

```
