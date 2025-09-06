import { PrimitiveType } from "./prop-types";

const root = globalThis as any;

export type Fetcher = (...args: any[]) => Promise<any>;

export interface FetcherMeta {
 
  name: string;
  
  displayName?: string;
 
  importName?: string;
  args: { name: string; type: PrimitiveType }[];
  returns: PrimitiveType;
  
  importPath: string;
  
  isDefaultExport?: boolean;
}

export interface FetcherRegistration {
  fetcher: Fetcher;
  meta: FetcherMeta;
}

declare global {
  interface Window {
    __StructoFetcherRegistry: FetcherRegistration[];
  }
}

root.__StructoFetcherRegistry = [];

export function registerFetcher(fetcher: Fetcher, meta: FetcherMeta) {
  root.__StructoFetcherRegistry.push({ fetcher, meta });
}
