import React from "react";
import Helmet from "react-helmet";
import {
  StructoComponent,
  StructoRootProvider,
  InitOptions,
  ComponentRenderData,
} from "@structoapp/loader-gatsby";
import { graphql, PageProps } from "gatsby";
import { initStructoLoaderWithRegistrations } from "../structo-init";

export const query = graphql`
  query ($path: String) {
    structoComponents(componentNames: [$path])
    structoOptions
  }
`;

interface StructoGatsbyPageProps extends PageProps {
  data: {
    structoOptions: InitOptions
    structoComponents: ComponentRenderData
  }
}

const StructoGatsbyPage = ({ data, location }: StructoGatsbyPageProps) => {
  const {
    structoComponents,
    structoOptions,
  } = data;
  const pageMeta = structoComponents.entryCompMetas[0];
  const pageMetadata = pageMeta.pageMetadata;
  return (
    <StructoRootProvider
      loader={initStructoLoaderWithRegistrations(structoOptions)}
      prefetchedData={structoComponents}
      pageRoute={pageMeta.path}
      pageParams={pageMeta.params}
      pageQuery={Object.fromEntries(new URLSearchParams(location.search))}
      Head={Helmet}
    >
      <Helmet>
        {pageMetadata?.title && <title>{pageMetadata.title}</title>}
        {pageMetadata?.title && <meta property="og:title" content={pageMetadata.title} /> }
        {pageMetadata?.description && <meta property="og:description" content={pageMetadata.description} />}
        {pageMetadata?.openGraphImageUrl && <meta property="og:image" content={pageMetadata.openGraphImageUrl} />}
      </Helmet>
      <StructoComponent component={pageMeta.displayName} />
    </StructoRootProvider>
  );
};

export default StructoGatsbyPage;
