

```ts

// @public (undocumented)
export const createStructoAppUser: typeof ensureStructoAppUser;

// @public (undocumented)
export function ensureStructoAppUser(opts: {
    host?: string;
    appSecret: string;
    roleId?: string;
} & UserIdentifier): Promise<StructoUserResult>;

// @public (undocumented)
export function getStructoAppUser(opts: {
    host?: string;
    appId: string;
    codeVerifier: string;
    code: string;
}): Promise<StructoUserResult>;

// @public (undocumented)
export function getStructoAppUserFromToken(opts: {
    host?: string;
    token: string;
}): Promise<StructoUserResult>;

// @public (undocumented)
export interface StructoUser {
    // (undocumented)
    email: string;
    // (undocumented)
    properties: Record<string, unknown> | null;
    // (undocumented)
    roleId: string;
    // (undocumented)
    roleIds: string[];
    // (undocumented)
    roleName: string;
    // (undocumented)
    roleNames: string[];
}

// @public (undocumented)
export type StructoUserResult = {
    user: null;
    token: null;
    error: Error;
} | {
    user: StructoUser;
    token: string;
    error?: never;
};

// (No @packageDocumentation comment for this package)

```
