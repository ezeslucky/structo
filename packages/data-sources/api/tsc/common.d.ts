import { useMutableStructoQueryData } from "@structoapp/query";
import { ClientQueryResult } from "./types";
interface StructoUndefinedDataErrorPromise extends Promise<any> {
    structoType: "StructoUndefinedDataError";
    message: string;
}
export declare function isStructoUndefinedDataErrorPromise(x: any): x is StructoUndefinedDataErrorPromise;
export declare function mkUndefinedDataProxy(promiseRef: {
    fetchingPromise: Promise<any> | undefined;
}, fetchAndUpdateCache: (() => Promise<any>) | undefined): any;
export declare function useStructoFetch<T, R, E = any>(key: string | null, resolvedParams: any, fetcherFn: (resolvedParam: any) => Promise<T>, resultMapper: (result: ReturnType<typeof useMutableStructoQueryData<T, E>>) => ClientQueryResult<R>, undefinedDataProxyFields: ("data" | "schema" | "error")[], opts: {
    fallbackData?: T;
    noUndefinedDataProxy?: boolean;
}): ClientQueryResult<R>;
export declare function getConfig<T>(key: string, defaultValue: T): any;
export {};
