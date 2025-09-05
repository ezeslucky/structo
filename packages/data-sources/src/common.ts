import {
  useMutableStructoQueryData,
  useStructoDataConfig,
} from "@structoapp/host";
// eslint-disable-next-line no-restricted-imports
import * as ph from "@structoapp/host";
import React from "react";
import { ClientQueryResult } from "./types";

interface StructoUndefinedDataErrorPromise extends Promise<any> {
  structoType: "StructoUndefinedDataError";
  message: string;
}

export function isStructoUndefinedDataErrorPromise(
  x: any
): x is StructoUndefinedDataErrorPromise {
  return (
    !!x &&
    typeof x === "object" &&
    x?.structoType === "StructoUndefinedDataError"
  );
}

export function mkUndefinedDataProxy(
  promiseRef: { fetchingPromise: Promise<any> | undefined },
  fetchAndUpdateCache: (() => Promise<any>) | undefined
) {
  let fetchAndUpdatePromise: Promise<any> | undefined = undefined;

  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === "isStructoUndefinedDataProxy") {
          return true;
        }

        if (!fetchAndUpdateCache) {
          // There's no key so no fetch to kick off yet; when computing key,
          // we encountered some thrown exception (that's not an undefined data promise),
          // and so we can't fetch yet. This might be dependent on a $state or $prop value
          // that's currently undefined, etc.  We will act like an undefined data object,
          // and trigger the usual fallback behavior
          return undefined;
        }

        const doFetchAndUpdate = () => {
          // We hold onto the promise last returned by fetchAndUpdateCache()
          // and keep reusing it until it is resolved. The reason is that the
          // Promise thrown here will be used as a dependency for memoized
          // fetchAndUpdateCache, which is a dependency on the memoized returned value
          // from useStructoDataOp(). If we have a fetch that's taking a long time,
          // we want to make sure that our memoized returned value is stable,
          // so that we don't keep calling setDollarQueries() (otherwise, for each
          // render, we find an unstable result, and call setDollarQueries(),
          // resulting in an infinite loop while fetch is happening).
          if (!fetchAndUpdatePromise) {
            fetchAndUpdatePromise = fetchAndUpdateCache().finally(() => {
              fetchAndUpdatePromise = undefined;
            });
          }
          return fetchAndUpdatePromise;
        };

        const promise =
          // existing fetch
          promiseRef.fetchingPromise ||
          // No existing fetch, so kick off a fetch
          doFetchAndUpdate();
        (promise as any).structoType = "StructoUndefinedDataError";
        (promise as any).message = `Cannot read property ${String(
          prop
        )} - data is still loading`;
        throw promise;
      },
    }
  ) as any;
}

const isRSC = (React as any).isRSC;
const reactMajorVersion = +React.version.split(".")[0];
const enableLoadingBoundaryKey = "structoInternalEnableLoadingBoundary";

/**
 * Fetches can be kicked off two ways -- normally, by useSWR(), or by some
 * expression accessing the `$queries.*` proxy when not ready yet. We need
 * a global cache for proxy-invoked caches, so that different components
 * with the same key can share the same fetch.
 *
 * The life cycle for this cache is short -- only the duration of a
 * proxy-invoked fetch, and once the fetch is done. That's because we really
 * just want SWR to be managing the cache, not us! Once the data is in SWR,
 * we will use SWR for getting data.
 */
const PRE_FETCHES = new Map<string, Promise<any>>();

export function useStructoFetch<T, R, E = any>(
  key: string | null,
  resolvedParams: any,
  fetcherFn: (resolvedParam: any) => Promise<T>,
  resultMapper: (
    result: ReturnType<typeof useMutableStructoQueryData<T, E>>
  ) => ClientQueryResult<R>,
  undefinedDataProxyFields: ("data" | "schema" | "error")[],
  opts: {
    fallbackData?: T;
    noUndefinedDataProxy?: boolean;
  }
) {
  const enableLoadingBoundary = !!ph.useDataEnv?.()?.[enableLoadingBoundaryKey];
  const { mutate, cache } = isRSC
    ? ({} as any as Partial<ReturnType<typeof useStructoDataConfig>>)
    : useStructoDataConfig();
  // Cannot perform this operation
  const isNullParams = !resolvedParams;
  // This operation depends on another data query to resolve first
  const isWaitingOnDependentQuery =
    isStructoUndefinedDataErrorPromise(resolvedParams);
  const fetchingData = React.useMemo(
    () => ({
      fetchingPromise: undefined as Promise<T> | undefined,
    }),
    [key]
  );
  const fetcher = React.useMemo(
    () => () => {
      // If we are in this function, that means SWR cache missed.
      if (!key) {
        throw new Error(`Fetcher should never be called without a proper key`);
      }

      // dataOp is guaranteed to be a DataOp, and not an undefined promise or null

      if (fetchingData.fetchingPromise) {
        // Fetch is already underway from this hook
        return fetchingData.fetchingPromise;
      }

      if (key && PRE_FETCHES.has(key)) {
        // Some other useStructoDataOp() hook elsewhere has already
        // started this fetch as well; re-use it here.
        const existing = PRE_FETCHES.get(key) as Promise<T>;
        fetchingData.fetchingPromise = existing;
        return existing;
      }

      // Else we really need to kick off this fetch now...
      const fetcherPromise = fetcherFn(resolvedParams);
      fetchingData.fetchingPromise = fetcherPromise;
      if (key) {
        PRE_FETCHES.set(key, fetcherPromise);
        // Once we have a result, we rely on swr to perform the caching,
        // so remove from our cache as quickly as possible.
        fetcherPromise.then(
          () => {
            PRE_FETCHES.delete(key);
          },
          () => {
            PRE_FETCHES.delete(key);
          }
        );
      }
      return fetcherPromise;
    },
    [key, fetchingData]
  );

  const dependentKeyDataErrorPromise = isStructoUndefinedDataErrorPromise(
    resolvedParams
  )
    ? resolvedParams
    : undefined;
  const fetchAndUpdateCache = React.useMemo(() => {
    if (!key && !dependentKeyDataErrorPromise) {
      // If there's no key, and no data query we're waiting for, then there's
      // no way to perform a fetch
      return undefined;
    }
    return () => {
      // This function is called when the undefined data proxy is invoked.
      // USUALLY, this means the data is not available in SWR yet, and
      // we need to kick off a fetch.

      if (fetchingData.fetchingPromise) {
        // No need to update cache as the exist promise call site will do it
        return fetchingData.fetchingPromise;
      }

      if (dependentKeyDataErrorPromise) {
        // We can't actually fetch yet, because we couldn't even evaluate the dataOp
        // to fetch for, because we depend on unfetched data. Once _that_
        // dataOp we depend on is finished, then we can try again.  So we
        // will throw and wait for _that_ promise to be resolved instead.
        return dependentKeyDataErrorPromise;
      }

      if (!key) {
        throw new Error(`Expected key to be non-null`);
      }

      
      const cached = cache?.get(key);
      if (cached) {
        return Promise.resolve(cached);
      }
      const cachedError = cache?.get(`$swr$${key}`);
      if (cachedError) {
        return Promise.reject(cachedError.error);
      }

      const fetcherPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          fetcher().then(resolve, reject);
        }, 1);
      });
      if (!isRSC) {
        fetcherPromise
          .then((data) => {
            // Insert the fetched data into the SWR cache
            mutate?.(key, data);
          })
          .catch((err) => {
            // Cache the error here to avoid infinite loop
            const keyInfo = key ? "$swr$" + key : "";
            cache?.set(keyInfo, { ...(cache?.get(keyInfo) ?? {}), error: err });
          });
      }
      return fetcherPromise;
    };
  }, [fetcher, fetchingData, cache, key, dependentKeyDataErrorPromise]);
  const res = useMutableStructoQueryData<T, E>(key, fetcher, {
    fallbackData: opts?.fallbackData,
    shouldRetryOnError: false,

    // If revalidateIfStale is true, then if there's a cache entry with a key,
    // but no mounted hook with that key yet, and when the hook mounts with the key,
    // swr will revalidate. This may be reasonable behavior, but for us, this
    // happens all the time -- we prepopulate the cache with proxy-invoked fetch,
    // sometimes before swr had a chance to run the effect.  So we turn off
    // revalidateIfStale here, and just let the user manage invalidation.
    revalidateIfStale: false,
  });
  const { data, error, isLoading } = res;
  if (fetchingData.fetchingPromise != null && data !== undefined) {
    // Clear the fetching promise as the actual data is now used (so
    // revalidation is possible)
    fetchingData.fetchingPromise = undefined;
  }

  return React.useMemo(() => {
    const result = resultMapper(res);
    if (
      !opts?.noUndefinedDataProxy &&
      reactMajorVersion >= 18 &&
      enableLoadingBoundary &&
      (isLoading || isNullParams || isWaitingOnDependentQuery) &&
      undefinedDataProxyFields.every((field) => result[field] === undefined)
    ) {
      undefinedDataProxyFields.forEach((field) => {
        if (field === "error") {
          return;
        }
        result[field] = mkUndefinedDataProxy(fetchingData, fetchAndUpdateCache);
      });
    }
    return result;
  }, [
    isNullParams,
    isWaitingOnDependentQuery,
    data,
    error,
    isLoading,
    opts?.noUndefinedDataProxy,
    enableLoadingBoundary,
    fetchingData,
    fetchAndUpdateCache,
  ]);
}


export function getConfig<T>(key: string, defaultValue: T) {
  if (typeof globalThis === "undefined") {
    return defaultValue;
  } else {
    return (globalThis as any).__STRUCTO__?.[key] ?? defaultValue;
  }
}
