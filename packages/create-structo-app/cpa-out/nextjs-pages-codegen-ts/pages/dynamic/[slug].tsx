
import * as React from "react";
import { PageParamsProvider as PageParamsProvider__ } from "@structoapp/react-web/lib/host";

import { StructoDynamicPage } from "../../components/structo/create_structo_app/StructoDynamicPage";
import { useRouter } from "next/router";

function DynamicPage() {

  return (
    <PageParamsProvider__
      route={useRouter()?.pathname}
      params={useRouter()?.query}
      query={useRouter()?.query}
    >
      <StructoDynamicPage />
    </PageParamsProvider__>
  );
}

export default DynamicPage;
