import React from "react";
import Helmet from "react-helmet";
import {
  StructoComponent,
  StructoRootProvider,
} from "@structoapp/loader-gatsby";
import { graphql } from "gatsby";
import { initStructoLoaderWithRegistrations } from "../structo-init";

export const query = graphql`
  query ($path: String) {
    structoComponents(componentNames: [$path])
    structoOptions
  }
`;


const StructoGatsbyPage = ({ data, location }) => {
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
