
import * as React from "react";
import { PageParamsProvider as PageParamsProvider__ } from "@structoapp/react-web/lib/host";

import {
  StructoDynamicPage,
  Head
} from "../../components/structo/create_structo_app/StructoDynamicPage";
import type { PageProps } from "gatsby";
export { Head };

function DynamicPage({ location, path, params }: PageProps) {

  return (
    <PageParamsProvider__
      route={path}
      params={params}
      query={Object.fromEntries(new URLSearchParams(location.search))}
    >
      <StructoDynamicPage />
    </PageParamsProvider__>
  );
}

export default DynamicPage;
