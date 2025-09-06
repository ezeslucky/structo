import React from 'react';

export interface StructoDataSourceContextValue {
  userAuthToken?: string | null;
  isUserLoading?: boolean;
  authRedirectUri?: string;
  user?: {
    email: string;
    properties: Record<string, unknown> | null;
    roleId: string;
    roleName: string;
    roleIds: string[];
    roleNames: string[];
  } | null;
}

const StructoDataSourceContext = React.createContext<
  StructoDataSourceContextValue | undefined
>(undefined);

export function useStructoDataSourceContext() {
  return React.useContext(StructoDataSourceContext);
}

export function useCurrentUser() {
  const ctx = useStructoDataSourceContext();
  return (
    ctx?.user ?? {
      isLoggedIn: false,
    }
  );
}

export const StructoDataSourceContextProvider =
  StructoDataSourceContext.Provider;
