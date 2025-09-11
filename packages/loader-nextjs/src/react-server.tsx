import "server-only";

import {
  InternalStructoComponentLoader,
  StructoComponentLoader,
} from "@structoapp/loader-react/react-server";
import type { IncomingMessage, ServerResponse } from "http";
import NextHead from "next/head.js";
import NextLink from "next/link.js";
import * as NextRouter from "next/router.js";
import { initStructoLoaderWithCache } from "./cache";
import type { NextInitOptions } from "./shared-exports";

import { __EXPERMIENTAL__extractStructoQueryData as internalExtractStructoQueryData } from "@structoapp/loader-react/react-server";
import { ExtractStructoQueryData } from "@structoapp/nextjs-app-router";
import {
  fetchExtractedHeadMetadata,
  fetchExtractedQueryData,
  withStructoMetadata,
} from "@structoapp/nextjs-app-router/react-server";

export * from "./shared-exports";
export {
  fetchExtractedQueryData as __EXPERMIENTAL__fetchExtractedQueryData,
  fetchExtractedHeadMetadata as __EXPERMIENTAL__fetchExtractedHeadMetadata,
  withStructoMetadata as __EXPERMIENTAL__withStructoMetadata,
};

import React from "react";
import type * as ClientExports from ".";

type ServerRequest = IncomingMessage & {
  cookies: {
    [key: string]: string;
  };
};

export class NextJsStructoComponentLoader extends StructoComponentLoader {
  constructor(internal: InternalStructoComponentLoader) {
    super(internal);
  }

  async getActiveVariation(opts: {
    req?: ServerRequest;
    res?: ServerResponse;
    known?: Record<string, string>;
    traits: Record<string, string | number | boolean>;
  }) {
    const extractBuiltinTraits = () => {
      const url = new URL(
        opts.req?.url ?? "/",
        `https://${opts.req?.headers.host ?? "server.side"}`
      );
      return {
        pageUrl: url.href,
      };
    };

    return this._getActiveVariation({
      traits: {
        ...extractBuiltinTraits(),
        ...opts.traits,
      },
      getKnownValue: (key: string) => {
        if (opts.known) {
          return opts.known[key];
        } else {
          return opts.req?.cookies[`structo:${key}`] ?? undefined;
        }
      },
      updateKnownValue: (key: string, value: string) => {
        if (opts.res) {
          const cookie = `structo:${key}=${value}`;
          const resCookie = opts.res?.getHeader("Set-Cookie") ?? [];
          let newCookies: string[] = [];
          if (Array.isArray(resCookie)) {
            newCookies = [...resCookie, `structo:${key}=${value}`];
          } else {
            newCookies = [`${resCookie}`, cookie];
          }

          opts.res?.setHeader("Set-Cookie", newCookies);
        }
      },
    });
  }
}

export function initStructoLoader(opts: NextInitOptions) {
  const loader = initStructoLoaderWithCache<NextJsStructoComponentLoader>(
    (opts) =>
      new StructoComponentLoader(new InternalStructoComponentLoader(opts)),
    opts
  );
  loader.registerModules({
    "next/head": NextHead,
    "next/link": NextLink,
    "next/router": NextRouter,
  });
  if (opts.nextNavigation) {
    loader.registerModules({
      "next/navigation": opts.nextNavigation,
    });
  }
  return loader;
}

export const __EXPERMIENTAL__extractStructoQueryData: (
  element: React.ReactElement,
  
  loader: ClientExports.NextJsStructoComponentLoader
) => Promise<Record<string, any>> = internalExtractStructoQueryData as any;


export async function __EXPERMIENTAL__withExtractStructoQueryData(
  structoRootProvider: React.ReactElement,
  {
    pathname,
    searchParams,
  }: {
    pathname: string;
    searchParams: Record<string, string | string[]> | undefined;
  }
) {
  const isStructoSsr =
    !!searchParams?.["structoSsr"] && searchParams?.["structoSsr"] !== "false";

  // If `structoSsr` search param is set, just wrap the root provider inside
  // <ExtractstructoQueryData>
  if (isStructoSsr) {
    return (
      <ExtractStructoQueryData>{structoRootProvider}</ExtractStructoQueryData>
    );
  }

  // Otherwise, fetch the same endpoint, but setting `structoSsr` to extract the
  // query data.
  const prepassHost =
    process.env.STRUCTO_PREPASS_HOST ??
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
    `http://localhost:${process.env.PORT ?? 3000}`;

  // Build a copy of the search params
  const newSearchParams = new URLSearchParams(
    Object.entries(searchParams ?? {}).flatMap(([key, values]) =>
      Array.isArray(values) ? values.map((v) => [key, v]) : [[key, values]]
    )
  );

  // Set `structoSsr` search param to indicate you are using this endpoint
  // to extract query data.
  newSearchParams.set("structoSsr", "true");

  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    // If protection bypass is enabled, use it to ensure fetching from
    // the SSR endpoint will not return the authentication page HTML
    newSearchParams.set(
      "x-vercel-protection-bypass",
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    );
  }

  // Fetch the data from the endpoint using the new search params
  const prefetchedQueryData = await fetchExtractedQueryData(
    `${prepassHost}${pathname}?${newSearchParams.toString()}`
  );

  return React.cloneElement(structoRootProvider, {
    prefetchedQueryData,
  });
}
