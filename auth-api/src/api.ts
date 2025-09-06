import fetch from "@Plasmicapp/isomorphic-unfetch";

const STRUCTO_HOST = "https://data.structo.app";

export interface StructoUser {
  email: string;
  properties: Record<string, unknown> | null;
  roleId: string;
  roleName: string;
  roleIds: string[];
  roleNames: string[];
}

export type StructoUserResult =
  | {
      user: null;
      token: null;
      error: Error;
    }
  | {
      user: StructoUser;
      token: string;
      error?: never;
    };

export async function getStructoAppUserFromToken(opts: {
  host?: string;
  token: string;
}): Promise<StructoUserResult> {
  const { host, token } = opts;
  const url = `${host || STRUCTO_HOST}/api/v1/app-auth/userinfo`;
  const result = await fetch(url, {
    headers: {
      "x-structo-data-user-auth-token": token,
    },
  });

  const user = await result.json();

  if (result.status >= 400) {
    return {
      user: null,
      token: null,
      error: new Error("Invalid token"),
    };
  }

  return {
    user,
    token,
  };
}

export async function getStructoAppUser(opts: {
  host?: string;
  appId: string;
  codeVerifier: string;
  code: string;
}): Promise<StructoUserResult> {
  const { host, appId, codeVerifier, code } = opts;

  const requestParams = new URLSearchParams();
  requestParams.set("grant_type", "authorization_code");
  requestParams.set("code", code);
  requestParams.set("code_verifier", codeVerifier);
  requestParams.set("client_id", appId);

  const url = `${
    host || STRUCTO_HOST
  }/api/v1/app-auth/token?${requestParams.toString()}`;
  const result = await fetch(url);

  const { token, user, error } = await result.json();

  if (result.status >= 400 || error) {
    return {
      user: null,
      token: null,
      error: error ?? new Error("Internal error"),
    };
  }

  return {
    user,
    token,
  };
}

type UserIdentifier = { email: string } | { externalId: string };

export async function ensureStructoAppUser(
  opts: {
    host?: string;
    appSecret: string;
    roleId?: string;
  } & UserIdentifier
): Promise<StructoUserResult> {
  const { host, appSecret, roleId } = opts;

  const email = "email" in opts ? opts.email : undefined;
  const externalId = "externalId" in opts ? opts.externalId : undefined;

  const url = `${host || STRUCTO_HOST}/api/v1/app-auth/user`;
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-structo-app-auth-api-token": appSecret,
    },
    body: JSON.stringify({
      email,
      externalId,
      roleId,
    }),
  });

  const { user, token, error } = await result.json();

  if (result.status >= 400 || error) {
    return {
      user: null,
      token: null,
      error: error ?? new Error("Internal error"),
    };
  }

  return {
    user,
    token,
  };
}

export const createStructoAppUser = ensureStructoAppUser;
