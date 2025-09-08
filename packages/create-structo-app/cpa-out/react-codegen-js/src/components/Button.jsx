import * as React from "react";
import { StructoButton } from "./structo/create_structo_app/StructoButton";

function Button_(props, ref) {
  const { structoProps } = StructoButton.useBehavior(props, ref);
  return <StructoButton {...structoProps} />;
}

const Button = React.forwardRef(Button_);

export default Object.assign(Button, { __plumeType: "button" });
