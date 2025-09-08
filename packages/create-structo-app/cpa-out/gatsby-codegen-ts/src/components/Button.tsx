import * as React from "react";
import {
  StructoButton,
  DefaultButtonProps
} from "./structo/create_structo_app/StructoButton";

import {
  ButtonRef,
  HtmlAnchorOnlyProps,
  HtmlButtonOnlyProps
} from "@structoapp/react-web";

export interface ButtonProps extends DefaultButtonProps {
  // Feel free to add any additional props that this component should receive
}
function Button_(props: ButtonProps, ref: ButtonRef) {
  const { structoProps } = StructoButton.useBehavior<ButtonProps>(props, ref);
  return <StructoButton {...structoProps} />;
}

export type ButtonComponentType = {
  (
    props: Omit<ButtonProps, HtmlAnchorOnlyProps> & {
      ref?: React.Ref<HTMLButtonElement>;
    }
  ): React.ReactElement;
  (
    props: Omit<ButtonProps, HtmlButtonOnlyProps> & {
      ref?: React.Ref<HTMLAnchorElement>;
    }
  ): React.ReactElement;
};
const Button = React.forwardRef(Button_) as any as ButtonComponentType;

export default Object.assign(Button, { __plumeType: "button" });
