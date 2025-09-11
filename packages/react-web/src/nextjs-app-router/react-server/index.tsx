import { ExtractStructoQueryData } from "@structoapp/nextjs-app-router";
import {
  fetchExtractedHeadMetadata,
  fetchExtractedQueryData,
  withStructoMetadata,
} from "@structoapp/nextjs-app-router/react-server";
import { StructoQueryDataProvider } from "@structoapp/query";
import React from "react";

export {
  fetchExtractedQueryData as __EXPERMIENTAL__fetchExtractedQueryData,
  fetchExtractedHeadMetadata as __EXPERMIENTAL__fetchExtractedHeadMetadata,
  withStructoMetadata as __EXPERMIENTAL__withStructoMetadata,
};


export async function __EXPERMIENTAL__withExtractStructoQueryData(
  pageRootElt: React.ReactElement,
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

  // If `plasmicSsr` search param is set, just wrap the page inside
  // <ExtractPlasmicQueryData>
  if (isStructoSsr) {
    return <ExtractStructoQueryData>{pageRootElt}</ExtractStructoQueryData>;
  }

  // Otherwise, fetch the same endpoint, but setting `plasmicSsr` to extract the
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

  // Set `plasmicSsr` search param to indicate you are using this endpoint
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

  // Provide the query data to your page
  return (
    <StructoQueryDataProvider prefetchedCache={prefetchedQueryData}>
      {pageRootElt}
    </StructoQueryDataProvider>
  );
}
