
import { Fetcher, SWRConfiguration } from "swr"
import { useSWRConfig } from "swr"
import React, { PropsWithChildren } from "react";
import useSWR, {
 
  Key,
  SWRConfig,
  SWRResponse,
  
} from "swr";
export type {SWRResponse} from "swr"

let __SWRConfig: ReturnType<typeof useSWRConfig> | undefined = undefined;

export const mutateKeys = (invalidateKey?: string) => {
    if(__SWRConfig){
        const {cache, mutate} = __SWRConfig;
        (invalidateKey != null ? [invalidateKey]: Array.from((cache as Map<string, any>).keys())).forEach((key) => {
            mutate(key)
        })
    }
};

function getStructoDefaultSWROptions(opts?:{
    isMutable?: boolean;
}): SWRConfiguration{
    return {
        revalidateIfStale: !!opts?.isMutable,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    }
}


export function usePlasmicQueryData<T>(
  key: Key,
  fetcher: Fetcher<T>
): { data?: T; error?: Error; isLoading?: boolean } {
  const prepassCtx = React.useContext(PrepassContext);

  const opts = getStructoDefaultSWROptions();
  if (prepassCtx) {
    
    opts.suspense = true;
  }

  const config = useSWRConfig();
  React.useEffect(() => {
    __SWRConfig = config;
  }, [config]);

  const wrappedFetcher = React.useMemo(
    () => wrapLoadingFetcher(fetcher),
    [fetcher]
  );

  const resp = useSWR(key, wrappedFetcher, opts);
  if (resp.data !== undefined) {
    return { data: resp.data };
  } else if (resp.error) {
    return { error: resp.error };
  } else {
    return { isLoading: true };
  }
}


export function useMutableStructoQueryData<T, E>(
    key: Key,
    fetcher: Fetcher<T>,
    options?: SWRConfiguration<T, E>

): SWRResponse<T, E> & {isLoading?: boolean;
    islagging?: boolean 
}{
    const prepassCtx = React.useContext(PrepassContext);

    const opts = {
        ...getStructoDefaultSWROptions({isMutable: true}),
        ...options,
    };
    if(prepassCtx){
        opts.suspense = true;
    }

    const config = useSWRConfig();
    React.useEffect(() =>{
        __SWRConfig = config;
    }, [config])

   const [isLoading, setIsLoading] = React.useState(false);
  const fetcherWrapper = React.useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      try {
        //@ts-ignore
        return await wrapLoadingFetcher(fetcher)(...args);
      } finally {
        setIsLoading(false);
      }
    },
    [fetcher]
    )

//@ts-ignore
   const laggyDataRef = React.useRef<any>();

  const { isValidating, mutate, data, error } = useSWR(
    key,
    fetcherWrapper,
    opts
  );

  React.useEffect(() => {
    if (data !== undefined) {
      laggyDataRef.current = data;
    }
  }, [data]);
//@ts-ignore
  return React.useMemo(
    () => ({
      isValidating,
      mutate,
      isLoading: (data === undefined && error === undefined) || isLoading,
      ...(data !== undefined
        ? { data }
        : error === undefined && laggyDataRef.current
        ? 
          { data: laggyDataRef.current, isLagging: true }
        : {}),
      ...(error !== undefined ? { error } : {}),
    }),
    [isValidating, mutate, data, error, isLoading]
  );
}


export function StructoQueryDataProvider(props:{
    suspense?: boolean;
    children: React.ReactNode;
    prefetchedCache?: Record<string, any>
}){
    const {children, suspense, prefetchedCache} = props;

    const prepass = React.useContext(PrepassContext);
    if(prepass){
        return <>{children}</>
    }else{
        return (
      <SWRConfig
        value={{
          fallback: prefetchedCache ?? {},
          suspense,
        }}
      >
        {children}
      </SWRConfig>
    );

    }
}

const PrepassContext = React.createContext<boolean>(false);

export function StructoPrepassContext(
    props: PropsWithChildren<{
        cache: Map<string, any>;
    }>
){
    const {cache, children} = props
    return (
          <PrepassContext.Provider value={true}>
      <SWRConfig
        value={{
          provider: () => cache,
          suspense: true,
          fallback: {},
        }}
      >
        {children}
      </SWRConfig>
    </PrepassContext.Provider>
    )
}


export const useStructoDataConfig: typeof useSWRConfig = useSWRConfig;

let loadingCount = 0;

export type LoadingStateListener = (isLoading: boolean) => void;
const listeners: LoadingStateListener[] = [];

export function addLoadingStateListener(
  listener: LoadingStateListener,
  opts?: { immediate?: boolean }
) {
  listeners.push(listener);
  if (opts?.immediate) {
    listener(loadingCount > 0);
  }
  return () => {
    listeners.splice(listeners.indexOf(listener), 1);
  };
}


export function wrapLoadingFetcher<
  T extends (...args: any[]) => Promise<any> | any
>(fetcher: T): T {
  return (async (...args: any) => {
    if (loadingCount === 0) {
      listeners.forEach((listener) => listener(true));
    }
    loadingCount += 1;
    try {
      const res = fetcher(...args);
      return isPromiseLike(res) ? await res : res;
    } finally {
      loadingCount -= 1;
      if (loadingCount === 0) {
        listeners.forEach((listener) => listener(false));
      }
    }
  }) as T;
}

function isPromiseLike(x: any) {
  return (
    !!x && typeof x === "object" && "then" in x && typeof x.then === "function"
  );
}

export function isPlasmicPrepass() {
  return !!(React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    ?.ReactCurrentDispatcher?.current?.isPlasmicPrepass;
}

export type HeadMetadata = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
};

export const HeadMetadataContext = React.createContext<HeadMetadata>({});
