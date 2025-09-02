## Api Report file for "@structo/query"

```ts

import {Fetcher} from 'swr';
import {Key} from 'swr';
import {PropsWithChildren} from 'react';
import {default as React_2} from 'react';
import {SWRConfiguration} from 'swr';
import {SWRResponse} from 'swr';
import {SWRConfig} from 'swr';


export function addLoadingStateListener(listener: LoadingStateListener, opts?: {
    immediate?: boolean;

}): () => void;

export type HeadMetadata = {
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
}


export const HeadMetedataContext: React_2.Context<HeadMetedata>;

export function isStructoPrepass(): boolean;

export type LoadingStateListener = (isLoading:boolean) => void;

export function StructoPrepassContext(props:PropsWithChildren<{
    cache: Map<string, any>;
}>): React_2.JSX.Element;

export function  StructoQueryDataProvider(props:{
    suspense?: boolean;
    children: react_2.ReactNode;
    prefetchedCache?: Record<string, any>;
}): react_2.JSX.Element;

export {SWRResponse}



export function useMutableStructoQueryData<T,E>(key: Key, fetcher:Fetcher<T>, options?:
    SWRConfiguration<T, E>
):SWRResponse<T, E> & {
    isLoading?: boolean;
    isLagging?: boolean;
}

export const useStructoDataConfig: typeof useSWRConfig;


export function useStructoQueryData<T>(key:Key,fetcher:Fetcher<T>):{
    data?: T;
    error?: Error;
    isLoading?: boolean;
}


export {useSWRConfig}

export function wrapLoadingFetcher<T extends(...args: any[]) => Promise<any> | any>(fetcher: T): T;

```