import {
  useMutableStructoQueryData,
  wrapLoadingFetcher,
} from "@structoapp/query";
import {
  getConfig,
  isStructoUndefinedDataErrorPromise,
  useStructoFetch,
} from "../common";
import { ClientQueryResult, ServerQuery, ServerQueryResult } from "../types";
import { pick } from "../utils";
import { resolveParams } from "./common";

type StudioCacheWrapper = <F extends (...args: any[]) => Promise<any>>(
  id: string,
  fn: F,
  ...args: Parameters<F>
) => Promise<any>;

export function makeQueryCacheKey(id: string, params: any[]) {
  return `${id}:${JSON.stringify(params)}`;
}

export function useStructoServerQuery<
  F extends (...args: any[]) => Promise<any>
>(
  serverQuery: ServerQuery<F>,
  fallbackData?: ReturnType<F>,
  opts?: { noUndefinedDataProxy?: boolean }
): Partial<ServerQueryResult<ReturnType<F>>> {
  const resolvedParams = resolveParams(serverQuery.execParams, (err) => {
    if (isStructoUndefinedDataErrorPromise(err)) {
      return err;
    }
    // We are swallowing the error here because it may be an invalid
    // access of a server query that is not yet ready
    return null;
  });
  const key =
    !resolvedParams || isStructoUndefinedDataErrorPromise(resolvedParams)
      ? null
      : makeQueryCacheKey(serverQuery.id, resolvedParams);
  const wrapStudioCache: StudioCacheWrapper = getConfig(
    "EXECUTE_SERVER_QUERY",
    (_: string, fn: F, ...args: Parameters<F>) => fn(...args)
  );

  const fetcher = (params: Parameters<F>) => {
    return wrapLoadingFetcher(wrapStudioCache)(
      serverQuery.id,
      serverQuery.fn,
      ...params
    );
  };

  const resultMapper = (
    result: ReturnType<typeof useMutableStructoQueryData<ReturnType<F>, any>>
  ): ClientQueryResult<ReturnType<F>> => {
    return {
      ...pick(result, "data", "error", "isLoading"),
    };
  };

  return useStructoFetch(
    key,
    resolvedParams,
    fetcher,
    resultMapper,
    ["data", "error"],
    {
      fallbackData,
      ...opts,
    }
  );
}
