import { ServerQuery, ServerQueryResult } from "../types";
export declare function makeQueryCacheKey(id: string, params: any[]): string;
export declare function useStructoServerQuery<F extends (...args: any[]) => Promise<any>>(serverQuery: ServerQuery<F>, fallbackData?: ReturnType<F>, opts?: {
    noUndefinedDataProxy?: boolean;
}): Partial<ServerQueryResult<ReturnType<F>>>;
