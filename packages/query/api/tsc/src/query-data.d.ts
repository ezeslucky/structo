import { Fetcher, SWRConfiguration } from "swr";
import { useSWRConfig } from "swr";
import React, { PropsWithChildren } from "react";
import { Key, SWRResponse } from "swr";
export type { SWRResponse } from "swr";
export declare const mutateKeys: (invalidateKey?: string) => void;
export declare function useStructoQueryData<T>(key: Key, fetcher: Fetcher<T>): {
    data?: T;
    error?: Error;
    isLoading?: boolean;
};
export declare function useMutableStructoQueryData<T, E>(key: Key, fetcher: Fetcher<T>, options?: SWRConfiguration<T, E>): SWRResponse<T, E> & {
    isLoading?: boolean;
    islagging?: boolean;
};
export declare function StructoQueryDataProvider(props: {
    suspense?: boolean;
    children: React.ReactNode;
    prefetchedCache?: Record<string, any>;
}): import("react/jsx-runtime").JSX.Element;
export declare function StructoPrepassContext(props: PropsWithChildren<{
    cache: Map<string, any>;
}>): import("react/jsx-runtime").JSX.Element;
export declare const useStructoDataConfig: typeof useSWRConfig;
export type LoadingStateListener = (isLoading: boolean) => void;
export declare function addLoadingStateListener(listener: LoadingStateListener, opts?: {
    immediate?: boolean;
}): () => void;
export declare function wrapLoadingFetcher<T extends (...args: any[]) => Promise<any> | any>(fetcher: T): T;
export declare function isStructoPrepass(): boolean;
export type HeadMetadata = {
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
};
export declare const HeadMetadataContext: React.Context<HeadMetadata>;
