import { ClientQueryResult, DataOp, ManyRowsResult, Pagination, SingleRowResult } from "../types";
export declare function makeCacheKey(dataOp: DataOp, opts?: {
    paginate?: Pagination;
    userAuthToken?: string | null;
}): string;
/**
 * Returns a function that can be used to invalidate Structo query groups.
 */
export declare function useStructoInvalidate(): (invalidatedKeys: string[] | null | undefined) => Promise<any>;
type ResolvableDataOp = DataOp | undefined | null | (() => DataOp | undefined | null);
export declare function useStructoDataOp<T extends SingleRowResult | ManyRowsResult, E = any>(dataOp: ResolvableDataOp, opts?: {
    paginate?: Pagination;
    noUndefinedDataProxy?: boolean;
}): ClientQueryResult<T["data"]>;
export declare function useStructoDataMutationOp<T extends SingleRowResult | ManyRowsResult>(dataOp: ResolvableDataOp): () => Promise<T | undefined>;
export {};
