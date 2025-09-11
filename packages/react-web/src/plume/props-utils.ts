import * as React from "react";
import { pick, pickBy } from "../common";
import {
  AnyStructoClass,
  StructoClassArgs,
  StructoClassOverrides,
  StructoClassVariants,
} from "./plume-utils";

export interface StyleProps {
  className?: string;
  style?: React.CSSProperties;
}

export function getStyleProps<P extends StyleProps>(props: P): StyleProps {
  return pick(props, "className", "style");
}

export function getDefaultStructoProps<C extends AnyStructoClass>(
  structoClass: C,
  props: Record<string, any>
) {
  return {
    structoProps: {
      variants: pick(
        props,
        ...structoClass.internalVariantProps
      ) as StructoClassVariants<C>,
      args: pick(
        props,
        ...structoClass.internalArgProps
      ) as StructoClassArgs<C>,
      overrides: {} as StructoClassOverrides<C>,
    },
  };
}

const RE_DATA_PROP = /^(data-.*)$/;

export function getDataProps(props: Record<string, any>) {
  return pickBy(props, (k) => RE_DATA_PROP.test(k));
}
