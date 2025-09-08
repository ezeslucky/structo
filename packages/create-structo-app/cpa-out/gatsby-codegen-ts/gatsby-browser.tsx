import React from "react";
import { StructoRootProvider } from "@structoapp/react-web";
import { Link } from "gatsby";
import Helmet from "react-helmet";

export const wrapRootElement = ({ element }) => {
  return (
    <StructoRootProvider Head={Helmet} Link={Link}>
      {element}
    </StructoRootProvider>
  );
}
