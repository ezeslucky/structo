

```ts

import { default as React_2 } from 'react';

// @public (undocumented)
export const StructoDataSourceContextProvider: React_2.Provider<StructoDataSourceContextValue | undefined>;

// @public (undocumented)
export interface StructoDataSourceContextValue {
    // (undocumented)
    authRedirectUri?: string;
    // (undocumented)
    isUserLoading?: boolean;
    // (undocumented)
    user?: {
        email: string;
        properties: Record<string, unknown> | null;
        roleId: string;
        roleName: string;
        roleIds: string[];
        roleNames: string[];
    } | null;
    // (undocumented)
    userAuthToken?: string | null;
}

// @public (undocumented)
export function useCurrentUser(): {
    email: string;
    properties: Record<string, unknown> | null;
    roleId: string;
    roleName: string;
    roleIds: string[];
    roleNames: string[];
} | {
    isLoggedIn: boolean;
};

// @public (undocumented)
export function useStructoDataSourceContext(): StructoDataSourceContextValue | undefined;

// (No @packageDocumentation comment for this package)

```
