import { useStructoDataSourceContext } from "@structoapp/data-sources-context";
import {
  useMutableStructoQueryData,
  useStructoDataConfig,
} from "@structoapp/query";
import * as React from "react";
import { isStructoUndefinedDataErrorPromise, useStructoFetch } from "../common";
import { executeStructoDataOp } from "../executor";
import {
  ClientQueryResult,
  DataOp,
  ManyRowsResult,
  Pagination,
  SingleRowResult,
} from "../types";
import { pick } from "../utils";

export function makeCacheKey(
  dataOp: DataOp,
  opts?: { paginate?: Pagination; userAuthToken?: string | null }
) {
  const queryDependencies = JSON.stringify({
    sourceId: dataOp.sourceId,
    opId: dataOp.opId,
    args: dataOp.userArgs,
    userAuthToken: opts?.userAuthToken,
    paginate: opts?.paginate,
  });
  return dataOp.cacheKey
    ? `${dataOp.cacheKey}${queryDependencies}`
    : queryDependencies;
}

/**
 * Returns a function that can be used to invalidate Structo query groups.
 */
export function useStructoInvalidate() {
  // NOTE: we use `revalidateIfStale: false` with SWR.
  // One quirk of this is that if you supply fallback data to swr,
  // that data doesn't get entered into the cache if `revalidateIfStale: false`,
  // so you won't see it if you iterate over keys of the cache. That's why
  // we have useStructoInvalidate() which will iterate over both the cache
  // and the fallback data.
  const { cache, fallback, mutate } = useStructoDataConfig();
  return async (invalidatedKeys: string[] | null | undefined) => {
    const getKeysToInvalidate = () => {
      if (!invalidatedKeys) {
        return [];
      }
      const allKeys = Array.from(
        new Set([
          ...Array.from((cache as any).keys()),
          ...(fallback ? Object.keys(fallback) : []),
         
          ...((globalThis as any).__STRUCTO_GET_ALL_CACHE_KEYS?.() ?? []),
        ])
      ).filter((key): key is string => typeof key === "string");
      if (invalidatedKeys.includes("structo_refresh_all")) {
        return allKeys;
      }
      return allKeys.filter((key) =>
        invalidatedKeys.some((k) => key.includes(`.$.${k}.$.`))
      );
    };

    const keys = getKeysToInvalidate();
    if (keys.length === 0) {
      return;
    }

    const invalidateKey = async (key: string) => {
      const studioInvalidate = (globalThis as any).__STRUCTO_MUTATE_DATA_OP;
      if (studioInvalidate) {
        await studioInvalidate(key);
      }
      return mutate(key);
    };

    return await Promise.all(keys.map((key) => invalidateKey(key)));
  };
}

type ResolvableDataOp =
  | DataOp
  | undefined
  | null
  | (() => DataOp | undefined | null);

function resolveDataOp(dataOp: ResolvableDataOp) {
  if (typeof dataOp === "function") {
    try {
      return dataOp();
    } catch (err) {
      if (isStructoUndefinedDataErrorPromise(err)) {
        return err;
      }
      return null;
    }
  } else {
    return dataOp;
  }
}

export function useStructoDataOp<
  T extends SingleRowResult | ManyRowsResult,
  E = any
>(
  dataOp: ResolvableDataOp,
  opts?: {
    paginate?: Pagination;
    noUndefinedDataProxy?: boolean;
  }
): ClientQueryResult<T["data"]> {
  const resolvedDataOp = resolveDataOp(dataOp);
  const ctx = useStructoDataSourceContext();
  const key =
    !resolvedDataOp || isStructoUndefinedDataErrorPromise(resolvedDataOp)
      ? null
      : makeCacheKey(resolvedDataOp, {
          paginate: opts?.paginate,
          userAuthToken: ctx?.userAuthToken,
        });
  const fetcher = (op: DataOp) => {
    return executeStructoDataOp<T>(op, {
      userAuthToken: ctx?.userAuthToken || undefined,
      user: ctx?.user,
      paginate: opts?.paginate,
    });
  };
  const resultMapper = (
    result: ReturnType<typeof useMutableStructoQueryData<T["data"], E>>
  ): ClientQueryResult<T["data"]> => {
    return {
      ...(result.data ?? {}),
      ...pick(result, "error", "isLoading"),
    };
  };
  return useStructoFetch<T["data"], E>(
    key,
    resolvedDataOp,
    fetcher,
    resultMapper,
    ["data", "schema", "error"],
    {
      noUndefinedDataProxy: opts?.noUndefinedDataProxy,
    }
  );
}

export function useStructoDataMutationOp<
  T extends SingleRowResult | ManyRowsResult
>(dataOp: ResolvableDataOp) {
  const ctx = useStructoDataSourceContext();
  const userToken = ctx?.userAuthToken;

  const getRealDataOp = React.useCallback(async () => {
    const tryGetRealDataOp = async (): Promise<DataOp | null> => {
      const resolved = resolveDataOp(dataOp);
      if (!resolved) {
        return null;
      } else if (isStructoUndefinedDataErrorPromise(resolved)) {
        // If calling the dataOp function resulted in a data fetch,
        // then we wait for the data fetch to finish and try
        // again
        await resolved;
        return tryGetRealDataOp();
      } else {
        return resolved;
      }
    };
    return await tryGetRealDataOp();
  }, [dataOp]);

  return React.useCallback(async () => {
    const { sourceId, opId, userArgs } = (await getRealDataOp()) ?? {};

    if (!sourceId || !opId) {
      return undefined;
    }

    return executeStructoDataOp<T>(
      { sourceId, opId, userArgs },
      {
        userAuthToken: userToken || undefined,
        user: ctx?.user,
      }
    );
  }, [getRealDataOp, userToken]);
}
