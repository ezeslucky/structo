import { useMenuTriggerState } from "@react-stately/menu";
import { Placement } from "@react-types/overlays";
import * as React from "react";
import { mergeProps } from "../../react-utils";
import { BaseMenuProps } from "../menu/menu";
import { TriggeredOverlayContext } from "../triggered-overlay/context";
import { useMenuTrigger } from "./menu-trigger";

export interface DropdownMenuProps {

  children: React.ReactElement;

 
  menu:
    | React.ReactElement<BaseMenuProps>
    | (() => React.ReactElement<BaseMenuProps>);

  placement?: Placement;

 
  isOpen?: boolean;

  
  defaultOpen?: boolean;

 
  onOpenChange?: (isOpen: boolean) => void;
}

export function DropdownMenu(props: DropdownMenuProps) {
  const { isOpen, defaultOpen, onOpenChange, children, placement, menu } =
    props;

  const triggerRef = React.useRef<HTMLElement>(null);

  const state = useMenuTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  });

  const { triggerProps, makeMenu, triggerContext } = useMenuTrigger(
    {
      triggerRef,
      placement,
      menu,
    },
    state
  );

  return (
    <TriggeredOverlayContext.Provider value={triggerContext}>
      {React.cloneElement(
        children,
        mergeProps(children.props, triggerProps, { ref: triggerRef })
      )}
      {state.isOpen && makeMenu()}
    </TriggeredOverlayContext.Provider>
  );
}
