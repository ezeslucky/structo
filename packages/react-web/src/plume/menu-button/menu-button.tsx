import { useFocusable } from "@react-aria/focus";
import { useMenuTriggerState } from "@react-stately/menu";
import { Placement } from "@react-types/overlays";
import { DOMProps, FocusableProps } from "@react-types/shared";
import * as React from "react";
import { pick } from "../../common";
import { mergeProps } from "../../react-utils";
import { Overrides } from "../../render/elements";
import { useEnsureSSRProvider } from "../../render/ssr";
import { BaseMenuProps } from "../menu/menu";
import {
  AnyStructoClass,
  mergeVariantToggles,
  StructoClassArgs,
  StructoClassOverrides,
  StructoClassVariants,
  VariantDef,
} from "../plume-utils";
import { getStyleProps, StyleProps } from "../props-utils";
import { TriggeredOverlayContext } from "../triggered-overlay/context";
import { useMenuTrigger } from "./menu-trigger";

export interface BaseMenuButtonProps
  extends DOMProps,
    FocusableProps,
    StyleProps,
    Pick<React.ComponentProps<"button">, "title"> {
  /**
   * The menu to show; can either be a Menu instance, or a function that returns a Menu
   * instance if you want to defer creating the instance till when it's opened.
   */
  menu:
    | React.ReactElement<BaseMenuProps>
    | (() => React.ReactElement<BaseMenuProps>);

  /**
   * Whether the button is disabled
   */
  isDisabled?: boolean;

  /**
   * Whether the menu is currently shown.
   */
  isOpen?: boolean;

  /**
   * Uncontrolled open state
   */
  defaultOpen?: boolean;

  /**
   * Event handler fired when Menu's open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Desired placement location of the Select dropdown
   */
  placement?: Placement;
  /**
   * If true, menu width will always match the trigger button width.
   * If false, then menu width will have min-width matching the
   * trigger button width.
   */
  menuMatchTriggerWidth?: boolean;

  /**
   * If set, menu width will be exactly this width, overriding
   * menuMatchTriggerWidth.
   */
  menuWidth?: number;
}

export interface MenuButtonConfig<C extends AnyStructoClass> {
  isOpenVariant: VariantDef<StructoClassVariants<C>>;
  isDisabledVariant?: VariantDef<StructoClassVariants<C>>;

  menuSlot: keyof StructoClassArgs<C>;

  root: keyof StructoClassOverrides<C>;
  trigger: keyof StructoClassOverrides<C>;
}

interface MenuButtonState {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

export type MenuButtonRef = React.Ref<MenuButtonRefValue>;

export interface MenuButtonRefValue extends MenuButtonState {
  getRoot: () => HTMLElement | null;
  getTrigger: () => HTMLElement | null;
  focus: () => void;
  blur: () => void;
}

export function useMenuButton<
  P extends BaseMenuButtonProps,
  C extends AnyStructoClass
>(
  structoClass: C,
  props: P,
  config: MenuButtonConfig<C>,
  outerRef: MenuButtonRef = null
) {
  const {
    placement,
    isOpen,
    defaultOpen,
    onOpenChange,
    isDisabled,
    menu,
    autoFocus,
    menuMatchTriggerWidth,
    menuWidth,
  } = props;

  useEnsureSSRProvider();
  const rootRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const state = useMenuTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });

  const { triggerProps, makeMenu, triggerContext } = useMenuTrigger(
    {
      isDisabled,
      triggerRef,
      placement,
      menuMatchTriggerWidth,
      menuWidth,
      menu,
    },
    state
  );

  const { focusableProps: triggerFocusProps } = useFocusable(props, triggerRef);

  const variants = {
    ...pick(props, ...structoClass.internalVariantProps),
    ...mergeVariantToggles(
      { def: config.isOpenVariant, active: state.isOpen },
      { def: config.isDisabledVariant, active: isDisabled }
    ),
  };

  const args = {
    ...pick(props, ...structoClass.internalArgProps),
    [config.menuSlot]: state.isOpen ? makeMenu() : undefined,
  };

  const overrides: Overrides = {
    [config.root]: {
      wrapChildren: (children: React.ReactNode) => (
        <TriggeredOverlayContext.Provider value={triggerContext}>
          {children}
        </TriggeredOverlayContext.Provider>
      ),
      props: {
        ref: rootRef,
      },
    },
    [config.trigger]: {
      props: mergeProps(
        triggerProps,
        triggerFocusProps,
        getStyleProps(props),
        pick(props, "title"),
        {
          ref: triggerRef,
          autoFocus,
          disabled: !!isDisabled,
          // Make sure this button is not interpreted as submit
          type: "button",
        }
      ),
    },
  };

  const plumeState: MenuButtonState = React.useMemo(
    () => ({
      open: () => state.open(),
      close: () => state.close(),
      isOpen: () => state.isOpen,
    }),
    [state]
  );

  React.useImperativeHandle(
    outerRef,
    () => ({
      getRoot: () => rootRef.current,
      getTrigger: () => triggerRef.current,
      focus: () => triggerRef.current && triggerRef.current.focus(),
      blur: () => triggerRef.current && triggerRef.current.blur(),
      open: plumeState.open,
      close: plumeState.close,
      isOpen: plumeState.isOpen,
    }),
    [rootRef, triggerRef, plumeState]
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
