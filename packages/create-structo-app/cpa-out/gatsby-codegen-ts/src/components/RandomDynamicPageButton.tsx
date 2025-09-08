
import * as React from "react";
import {
  StructoRandomDynamicPageButton,
  DefaultRandomDynamicPageButtonProps
} from "./structo/create_structo_app/StructoRandomDynamicPageButton";


export interface RandomDynamicPageButtonProps
  extends DefaultRandomDynamicPageButtonProps {}

function RandomDynamicPageButton(props: RandomDynamicPageButtonProps) {

  return <StructoRandomDynamicPageButton {...props} />;
}

export default RandomDynamicPageButton;
