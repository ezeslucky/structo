import type { HeadMetadata } from "@structoapp/query";
import { parse as parseHtml } from "node-html-parser";
import { Metadata } from "next";

export async function fetchExtractedQueryData(url: string) {
  const res = await fetch(url);
  if (res.status !== 200) {
    return undefined;
  }

  const html = await res.text();
  const root = parseHtml(html);
  const script = root.querySelector("script[data-structo-prefetch-id]");
  if (script) {
    return JSON.parse(script.innerHTML);
  }
  return undefined;
}

export async function fetchExtractedHeadMetadata(
  url: string
): Promise<HeadMetadata | undefined> {
  const res = await fetch(url);
  if (res.status !== 200) {
    return undefined;
  }

  const html = await res.text();
  const root = parseHtml(html);
  const script = root.querySelector("script[data-structo-head-metadata-id]");
  if (script) {
    return JSON.parse(script.innerHTML);
  }
  return undefined;
}


export async function withStructoMetadata({
  pathname,
  searchParams,
}: {
  pathname: string;
  searchParams: Record<string, string | string[]> | undefined;
}): Promise<object> {
  const isStructoSsr =
    !!searchParams?.["structoSsr"] && searchParams?.["structoSsr"] !== "false";

  if (isStructoSsr) {
    // We're building the metadata for SSR endpoint here; this endpoint is not
    // exposed for users, so we can just return an empty object.
    return {};
  }

  // Fetch the same page from SSR endpoint to retrieve Head metadata
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

  // Set `plasmicSsr` search param to indicate you are using the SSR endpoint.
  newSearchParams.set("structoSsr", "true");

  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    // If protection bypass is enabled, use it to ensure fetching from
    // the SSR endpoint will not return the authentication page HTML
    newSearchParams.set(
      "x-vercel-protection-bypass",
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    );
  }

  // Fetch and return the data from the endpoint using the new search params
  const prefetchedHeadMetadata = await fetchExtractedHeadMetadata(
    `${prepassHost}${pathname}?${newSearchParams.toString()}`
  );

  // Create metadata object
  const headMetadata: Metadata = {};
  if (
    prefetchedHeadMetadata &&
    Object.keys(prefetchedHeadMetadata).length > 0
  ) {
    if (prefetchedHeadMetadata.image) {
      headMetadata.twitter = {
        card: "summary_large_image",
        images: [prefetchedHeadMetadata.image],
      };
      headMetadata.openGraph = {
        images: [prefetchedHeadMetadata.image],
      };
    } else {
      headMetadata.twitter = {
        card: "summary",
      };
      headMetadata.openGraph = {};
    }
    if (prefetchedHeadMetadata.title) {
      headMetadata.title = prefetchedHeadMetadata.title;
      headMetadata.twitter.title = prefetchedHeadMetadata.title;
      headMetadata.openGraph.title = prefetchedHeadMetadata.title;
    }
    if (prefetchedHeadMetadata.description) {
      headMetadata.description = prefetchedHeadMetadata.description;
      headMetadata.twitter.description = prefetchedHeadMetadata.description;
      headMetadata.openGraph.description = prefetchedHeadMetadata.description;
    }
    if (prefetchedHeadMetadata.canonical) {
      headMetadata.alternates = {
        canonical: prefetchedHeadMetadata.canonical,
      };
    }
  }

  return headMetadata;
}
