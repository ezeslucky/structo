
import * as React from "react";
import {
  StructoDynamicPage,
  DefaultDynamicPageProps
} from "./structo/create_structo_app/StructoDynamicPage";
import { HTMLElementRefOf } from "@structoapp/react-web";


export interface DynamicPageProps extends DefaultDynamicPageProps {}

function DynamicPage_(props: DynamicPageProps, ref: HTMLElementRefOf<"div">) {
  

  return <StructoDynamicPage root={{ ref }} {...props} />;
}

const DynamicPage = React.forwardRef(DynamicPage_);
export default DynamicPage;
