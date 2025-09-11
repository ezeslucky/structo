import { useStructoCanvasContext } from "@structoapp/host";
import { useOption as useAriaOption } from "@react-aria/listbox";
import { Node } from "@react-types/shared";
import * as React from "react";
import { pick } from "../../common";
import { mergeProps, mergeRefs } from "../../react-utils";
import { Overrides } from "../../render/elements";
import { ItemLikeProps } from "../collection-utils";
import {
  AnyStructoClass,
  mergeVariantToggles,
  noOutline,
  StructoClassArgs,
  StructoClassOverrides,
  StructoClassVariants,
  PLUME_STRICT_MODE,
  VariantDef,
} from "../plume-utils";
import {
  getDefaultStructoProps,
  getStyleProps,
  StyleProps,
} from "../props-utils";
import { SelectContext } from "./context";

export interface BaseSelectOptionProps extends ItemLikeProps, StyleProps {}

interface SelectOptionConfig<C extends AnyStructoClass> {
  isSelectedVariant: VariantDef<StructoClassVariants<C>>;
  isDisabledVariant?: VariantDef<StructoClassVariants<C>>;
  isHighlightedVariant?: VariantDef<StructoClassVariants<C>>;

  labelSlot: keyof StructoClassArgs<C>;

  root: keyof StructoClassOverrides<C>;
  labelContainer: keyof StructoClassOverrides<C>;
}

export type SelectOptionRef = React.Ref<HTMLElement>;

export function useSelectOption<
  P extends BaseSelectOptionProps,
  C extends AnyStructoClass
>(
  structoClass: C,
  props: P,
  config: SelectOptionConfig<C>,
  outerRef: SelectOptionRef = null
) {
  const state = React.useContext(SelectContext);

  if (!state) {
    // If no context, then we are being incorrectly used.  Complain or just don't
    // bother installing any hooks.  It's okay to violate rules of hooks here
    // because this instance won't suddenly be used correctly in another render.
    if (PLUME_STRICT_MODE) {
      throw new Error(
        "You can only use a Select.Option within a Select component."
      );
    }

    return getDefaultStructoProps(structoClass, props);
  }

  const { children } = props;

  const canvasCtx = useStructoCanvasContext();
  const rootRef = React.useRef<HTMLElement>(null);
  const onRef = mergeRefs(rootRef, outerRef);

  // We pass in the Node secretly as an undocumented prop from <Select />
  const node = (props as any)._node as Node<
    React.ReactElement<BaseSelectOptionProps>
  >;

  const isSelected = state.selectionManager.isSelected(node.key);
  const isDisabled = state.disabledKeys.has(node.key);
  const isHighlighted =
    state.selectionManager.isFocused &&
    state.selectionManager.focusedKey === node.key;

  const { optionProps, labelProps } = useAriaOption(
    {
      isSelected,
      isDisabled,
      "aria-label": node && node["aria-label"],
      key: node.key,
      shouldSelectOnPressUp: true,
      shouldFocusOnHover: true,
      isVirtualized: false,
      shouldUseVirtualFocus: canvasCtx && !canvasCtx.interactive,
    },
    state,
    rootRef
  );

  const variants = {
    ...pick(props, ...structoClass.internalVariantProps),
    ...mergeVariantToggles(
      { def: config.isSelectedVariant, active: isSelected },
      { def: config.isDisabledVariant, active: isDisabled },
      { def: config.isHighlightedVariant, active: isHighlighted }
    ),
  };

  const args = {
    ...pick(props, ...structoClass.internalArgProps),
    [config.labelSlot]: children,
  };

  const overrides: Overrides = {
    [config.root]: {
      props: mergeProps(
        canvasCtx && !canvasCtx.interactive ? {} : optionProps,
        getStyleProps(props),
        {
          ref: onRef,
          style: noOutline(),
        }
      ),
    },
    [config.labelContainer]: {
      props: labelProps,
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
