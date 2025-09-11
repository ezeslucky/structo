import { useMenu as useAriaMenu } from "@react-aria/menu";
import { useTreeState } from "@react-stately/tree";
import { AriaMenuProps } from "@react-types/menu";
import { AriaLabelingProps, DOMProps } from "@react-types/shared";
import * as React from "react";
import { pick } from "../../common";
import { mergeProps } from "../../react-utils";
import { Overrides } from "../../render/elements";
import { useEnsureSSRProvider } from "../../render/ssr";
import {
  renderAsCollectionChild,
  renderCollectionNode,
  useDerivedItemsFromChildren,
} from "../collection-utils";
import {
  AnyStructoClass,
  noOutline,
  StructoClassArgs,
  StructoClassOverrides,
  StructoClassVariants,
  VariantDef,
} from "../plume-utils";
import { getStyleProps, StyleProps } from "../props-utils";
import { TriggeredOverlayContext } from "../triggered-overlay/context";
import { MenuContext } from "./context";

export interface BaseMenuProps extends DOMProps, AriaLabelingProps, StyleProps {
  /**
   * List of `Menu.Item`s or `Menu.Group`s that make up the menu
   */
  children?: React.ReactNode;

  /**
   * Called with the value of a `Menu.Item` when it is selected.
   */
  onAction?: (value: string) => void;
}

export type MenuRef = React.Ref<MenuRefValue>;
export interface MenuRefValue extends MenuState {
  getRoot: () => HTMLElement | null;
}

const COLLECTION_OPTS = {
  itemPlumeType: "menu-item",
  sectionPlumeType: "menu-group",
};

export interface MenuConfig<C extends AnyStructoClass> {
  isPlacedTopVariant?: VariantDef<StructoClassVariants<C>>;
  isPlacedBottomVariant?: VariantDef<StructoClassVariants<C>>;
  isPlacedLeftVariant?: VariantDef<StructoClassVariants<C>>;
  isPlacedRightVariant?: VariantDef<StructoClassVariants<C>>;

  itemsSlot: keyof StructoClassArgs<C>;
  itemsContainer: keyof StructoClassOverrides<C>;
  root: keyof StructoClassOverrides<C>;
}

/**
 * Converts props from BaseMenuProps to react-aria's useMenu() props.
 */
function asAriaMenuProps(props: BaseMenuProps) {
  const { children, ...rest } = props;
  const { items, disabledKeys } = useDerivedItemsFromChildren(children, {
    ...COLLECTION_OPTS,
    invalidChildError: `Can only use Menu.Item and Menu.Group as children to Menu`,
    requireItemValue: false,
  });

  const collectionChildRenderer = React.useCallback(
    (child: any) => renderAsCollectionChild(child, COLLECTION_OPTS),
    []
  );

  return {
    ariaProps: {
      ...rest,
      children: collectionChildRenderer,
      items,
      disabledKeys,
    } as AriaMenuProps<any>,
  };
}

export interface MenuState {
  getFocusedValue: () => string | null;
  setFocusedValue: (value: string) => void;
}

export function useMenu<P extends BaseMenuProps, C extends AnyStructoClass>(
  structoClass: C,
  props: P,
  config: MenuConfig<C>,
  ref: MenuRef = null
) {
  useEnsureSSRProvider();
  const { ariaProps } = asAriaMenuProps(props);
  const triggerContext = React.useContext(TriggeredOverlayContext);
  const rootRef = React.useRef<HTMLElement>(null);

  const state = useTreeState(ariaProps);

  const menuListRef = React.useRef<HTMLUListElement>(null);

  const { menuProps } = useAriaMenu(
    {
      ...ariaProps,
      autoFocus: triggerContext?.autoFocus,
    },
    state,
    menuListRef
  );

  const contextValue = React.useMemo(() => ({ state, menuProps: props }), [
    state,
    props,
  ]);

  const variants = {
    ...pick(props, ...structoClass.internalVariantProps),
  };

  const overrides: Overrides = {
    [config.root]: {
      props: mergeProps(getStyleProps(props), {
        ref: rootRef,
      }),
    },
    [config.itemsContainer]: {
      as: "ul",
      props: mergeProps(menuProps, {
        ref: menuListRef,
        style: {
          ...noOutline(),
        },
      }),
    },
  };

  const args = {
    ...pick(props, ...structoClass.internalArgProps),
    [config.itemsSlot]: (
      <MenuContext.Provider value={contextValue}>
        {Array.from(state.collection).map((node) => renderCollectionNode(node))}
      </MenuContext.Provider>
    ),
  };

  const plumeState: MenuState = React.useMemo(
    () => ({
      getFocusedValue: () => state.selectionManager.focusedKey as string | null,
      setFocusedValue: (value: string) =>
        state.selectionManager.setFocusedKey(value),
    }),
    [state]
  );

  React.useImperativeHandle(
    ref,
    () => ({
      getRoot: () => rootRef.current,
      getFocusedValue: () => plumeState.getFocusedValue(),
      setFocusedValue: (key) => plumeState.setFocusedValue(key),
    }),
    [rootRef, plumeState]
  );

  return {
    structoProps: {
      variants: variants as StructoClassVariants<C>,
      args: args as StructoClassArgs<C>,
      overrides: overrides as StructoClassOverrides<C>,
    },
    state: plumeState,
  };
}
