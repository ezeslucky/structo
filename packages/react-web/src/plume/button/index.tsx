import * as React from "react";
import { omit, pick } from "../../common";
import { Overrides } from "../../render/elements";
import {
  AnyStructoClass,
  mergeVariantToggles,
  StructoClassArgs,
  StructoClassOverrides,
  StructoClassVariants,
  VariantDef,
} from "../plume-utils";

interface PlumeCommonProps {
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
  isDisabled?: boolean;
}

interface HtmlButtonProps
  extends Omit<React.ComponentProps<"button">, "ref" | "disabled"> {}

interface HtmlAnchorProps
  extends Omit<React.ComponentProps<"a">, "ref" | "href" | "target"> {}

interface PlumeActualButtonProps {
  submitsForm?: boolean;
}

interface PlumeAnchorProps {
  link?: string;
  target?: React.ComponentProps<"a">["target"] | boolean;
}

export type PlumeButtonProps = PlumeCommonProps &
  PlumeActualButtonProps &
  PlumeAnchorProps;

export type BaseButtonProps = PlumeButtonProps &
  HtmlButtonProps &
  HtmlAnchorProps;

type AllButtonProps = PlumeCommonProps &
  PlumeActualButtonProps &
  HtmlButtonProps;
type AllAnchorProps = PlumeCommonProps & PlumeAnchorProps & HtmlAnchorProps;

export type HtmlAnchorOnlyProps = Exclude<
  keyof AllAnchorProps,
  keyof AllButtonProps
>;
export type HtmlButtonOnlyProps = Exclude<
  keyof AllButtonProps,
  keyof AllAnchorProps
>;

export type ButtonRef = React.Ref<HTMLButtonElement | HTMLAnchorElement>;

interface ButtonConfig<C extends AnyStructoClass> {
  showStartIconVariant: VariantDef<StructoClassVariants<C>>;
  showEndIconVariant?: VariantDef<StructoClassVariants<C>>;
  isDisabledVariant?: VariantDef<StructoClassVariants<C>>;
  startIconSlot?: keyof StructoClassArgs<C>;
  endIconSlot?: keyof StructoClassArgs<C>;
  contentSlot: keyof StructoClassArgs<C>;
  root: keyof StructoClassOverrides<C>;
}

export function useButton<
  P extends PlumeButtonProps,
  C extends AnyStructoClass
>(structoClass: C, props: P, config: ButtonConfig<C>, ref: ButtonRef = null) {
  const {
    link,
    isDisabled,
    startIcon,
    endIcon,
    showStartIcon,
    showEndIcon,
    children,
    target,
    submitsForm = false,
    ...rest
  } = props;
  const variants = {
    ...pick(props, ...structoClass.internalVariantProps),
    ...mergeVariantToggles(
      { def: config.showStartIconVariant, active: showStartIcon },
      { def: config.showEndIconVariant, active: showEndIcon },
      { def: config.isDisabledVariant, active: isDisabled }
    ),
  };

  const args = {
    ...pick(props, ...structoClass.internalArgProps),
    ...(config.startIconSlot && { [config.startIconSlot]: startIcon }),
    ...(config.endIconSlot && { [config.endIconSlot]: endIcon }),
    [config.contentSlot]: children,
  };

  let buttonType = undefined;
  if (!link) {
    if (
      !structoClass.internalVariantProps.includes("type") &&
      !structoClass.internalArgProps.includes("type") &&
      "type" in rest
    ) {
      // There's no Plasmic-defined variant or arg called "type",
      // but the user passed in a "type" arg, so must be an override
      // or direct instantiation. We use that value
      buttonType = rest.type;
    } else {
      // Otherwise, we set buttonType depending in submitsForm
      buttonType = submitsForm ? "submit" : "button";
    }
  }

  const overrides: Overrides = {
    [config.root]: {
      as: link ? "a" : "button",
      props: {
        // Put this at the top, as user may also have set `type` as
        // inherited from "button", so let `rest` override it
        ...omit(
          rest as any,
          ...structoClass.internalArgProps,
          ...structoClass.internalVariantProps
        ),
        type: buttonType,
        ref: ref,
        disabled: isDisabled,
        target:
          target === true ? "_blank" : target === false ? undefined : target,
        ...(!!link && { href: link }),
      },
    },
  };

  return {
    structoProps: {
      variants: variants as StructoClassVariants<C>,
      args: args as StructoClassArgs<C>,
      overrides: overrides as StructoClassOverrides<C>,
    },
  };
}
