import * as React from "react";
import {
  StructoComponent,
  extractStructoQueryData,
  ComponentRenderData,
  StructoRootProvider,
} from "@structoapp/loader-nextjs";
import type { GetStaticPaths, GetStaticProps } from "next";

import Error from "next/error";
import { useRouter } from "next/router";
import { STRUCTO } from "@/structo-init";

export default function StructoLoaderPage(props: {
  structoData?: ComponentRenderData;
  queryCache?: Record<string, unknown>;
}) {
  const { structoData, queryCache } = props;
  const router = useRouter();
  if (!structoData || structoData.entryCompMetas.length === 0) {
    return <Error statusCode={404} />;
  }
  const pageMeta = structoData.entryCompMetas[0];
  return (
    <StructoRootProvider
      loader={STRUCTO}
      prefetchedData={structoData}
      prefetchedQueryData={queryCache}
      pageRoute={pageMeta.path}
      pageParams={pageMeta.params}
      pageQuery={router.query}
    >
      <StructoComponent component={pageMeta.displayName} />
    </StructoRootProvider>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { catchall } = context.params ?? {};
  const structoPath = typeof catchall === 'string' ? catchall : Array.isArray(catchall) ? `/${catchall.join('/')}` : '/';
  const structoData = await STRUCTO.maybeFetchComponentData(structoPath);
  if (!structoData) {
    // non-structo catch-all
    return { props: {} };
  }
  const pageMeta = structoData.entryCompMetas[0];
  // Cache the necessary data fetched for the page
  const queryCache = await extractStructoQueryData(
    <StructoRootProvider
      loader={STRUCTO}
      prefetchedData={structoData}
      pageRoute={pageMeta.path}
      pageParams={pageMeta.params}
    >
      <StructoComponent component={pageMeta.displayName} />
    </StructoRootProvider>
  );
  // Use revalidate if you want incremental static regeneration
  return { props: { structoData, queryCache }, revalidate: 60 };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pageModules = await STRUCTO.fetchPages();
  return {
    paths: pageModules.map((mod) => ({
      params: {
        catchall: mod.path.substring(1).split("/"),
      },
    })),
    fallback: "blocking",
  };
}
