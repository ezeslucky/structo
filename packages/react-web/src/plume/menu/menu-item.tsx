import { Node } from "@react-types/shared";
import * as React from "react";
import { useMenuItem as useAriaMenuItem } from "@react-aria/menu";
import { pick } from "../../common";
import { mergeProps } from "../../react-utils";
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
import { getDefaultStructoProps } from "../props-utils";
import { TriggeredOverlayContext } from "../triggered-overlay/context";
import { MenuContext } from "./context";

export interface BaseMenuItemProps extends ItemLikeProps {
  /**
   * Called when this item is selected
   */
  onAction?: (key: string) => void;
}

interface MenuItemConfig<C extends AnyStructoClass> {
  isDisabledVariant?: VariantDef<StructoClassVariants<C>>;
  isHighlightedVariant?: VariantDef<StructoClassVariants<C>>;

  labelSlot: keyof StructoClassArgs<C>;

  root: keyof StructoClassOverrides<C>;
  labelContainer: keyof StructoClassOverrides<C>;
}

export function useMenuItem<
  P extends BaseMenuItemProps,
  C extends AnyStructoClass
>(structoClass: C, props: P, config: MenuItemConfig<C>) {
  const menuContext = React.useContext(MenuContext);
  const triggerContext = React.useContext(TriggeredOverlayContext);

  if (!menuContext) {
    if (PLUME_STRICT_MODE) {
      throw new Error("You can only use a Menu.Item within a Menu component.");
    }

    return getDefaultStructoProps(structoClass, props);
  }

  const { children, onAction } = props;

  const { state, menuProps } = menuContext;

  // We pass in the Node secretly as an undocumented prop from <Select />
  const node = (props as any)._node as Node<
    React.ReactElement<BaseMenuItemProps>
  >;

  const isDisabled = state.disabledKeys.has(node.key);
  const isHighlighted =
    state.selectionManager.isFocused &&
    state.selectionManager.focusedKey === node.key;

  const ref = React.useRef<HTMLLIElement>(null);

  const { menuItemProps, labelProps } = useAriaMenuItem(
    //@ts-ignore
    mergeProps(
      {
        // We need to merge both the onAction on MenuItem and the onAction
        // on Menu
        onAction,
      },
      {
        onAction: menuProps.onAction,
        onClose: triggerContext?.state.close,
      },
      {
        isDisabled,
        "aria-label": node && node["aria-label"],
        key: node.key,
        isVirtualized: false,
        closeOnSelect: true,
      }
    ),
    state,
    ref
  );

  const variants = {
    ...pick(props, ...structoClass.internalVariantProps),
    ...mergeVariantToggles(
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
      as: "li",
      props: mergeProps(menuItemProps, { ref, style: noOutline() }),
    },
    [config.labelContainer]: {
      props: { ...labelProps },
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
