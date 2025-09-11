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

export interface BaseTextInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "disabled">,
    PlumeTextInputProps {}

export interface PlumeTextInputProps {
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isDisabled?: boolean;
  type?: "text" | "password" | "email" | "url" | string;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}

export interface TextInputRefValue {
  focus: () => void;
  blur: () => void;
  getRoot: () => HTMLElement | null;
  getInput: () => HTMLInputElement | null;
}

export type TextInputRef = React.Ref<TextInputRefValue>;

interface TextInputConfig<C extends AnyStructoClass> {
  showStartIconVariant: VariantDef<StructoClassVariants<C>>;
  showEndIconVariant?: VariantDef<StructoClassVariants<C>>;
  isDisabledVariant?: VariantDef<StructoClassVariants<C>>;
  startIconSlot?: keyof StructoClassArgs<C>;
  endIconSlot?: keyof StructoClassArgs<C>;
  root: keyof StructoClassOverrides<C>;
  input: keyof StructoClassOverrides<C>;
}

export function useTextInput<
  P extends PlumeTextInputProps,
  C extends AnyStructoClass
>(
  structoClass: C,
  props: P,
  config: TextInputConfig<C>,
  ref: TextInputRef = null
) {
  const {
    isDisabled,
    startIcon,
    endIcon,
    showStartIcon,
    showEndIcon,
    className,
    style,
    inputClassName,
    inputStyle,
    ...rest
  } = props;
  const rootRef = React.useRef<HTMLElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(
    ref,
    () => ({
      focus() {
        inputRef.current?.focus();
      },
      blur() {
        inputRef.current?.blur();
      },
      getRoot() {
        return rootRef.current;
      },
      getInput() {
        return inputRef.current;
      },
      getBoundingClientRect() {
        return rootRef.current?.getBoundingClientRect();
      },
    }),
    [rootRef, inputRef]
  );

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
  };

  const overrides: Overrides = {
    [config.root]: {
      props: {
        ref: rootRef,
        className,
        style,
      },
    },
    [config.input]: {
      props: {
       
        ...omit(
          rest as any,
          ...structoClass.internalArgProps.filter(
            (prop) => prop !== "required" && prop !== "onChange"
          ),
          ...structoClass.internalVariantProps
        ),
        disabled: isDisabled,
        ref: inputRef,
        className: inputClassName,
        style: inputStyle,
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
