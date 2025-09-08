
import * as React from "react";
import { PageParamsProvider as PageParamsProvider__ } from "@structoapp/react-web/lib/host";
import { StructoHomepage } from "../components/structo/create_structo_app/StructoHomepage";
import { useRouter } from "next/router";

function Homepage() {
 
  return (
    <PageParamsProvider__
      route={useRouter()?.pathname}
      params={useRouter()?.query}
      query={useRouter()?.query}
    >
      <StructoHomepage />
    </PageParamsProvider__>
  );
}

export default Homepage;
