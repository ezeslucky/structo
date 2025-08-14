import { Dropdown, Menu } from "antd";
import React from "react";
import { UNKEYED_MENU_ITEM_TYPE } from "./registerMenu";
import { Registerable, registerComponentHelper } from "./utils";

function addKeysToUnkeyedMenuItems(
  unkeyedMenuItems: React.ComponentProps<typeof Menu>["items"],
  maybeGenKey?: () => string
) {
  const genKey =
    maybeGenKey ??
    (() => {
      let key = 0;
      return () => {
        return `${key++}`;
      };
    })();
  return unkeyedMenuItems?.map((item) => {
    if (!item) {
      return null;
    }
    const newItem = { ...item };
    if (!newItem.key) {
      newItem.key = genKey();
    }
    if ("children" in newItem && newItem.children) {
      newItem.children = addKeysToUnkeyedMenuItems(newItem.children, genKey);
    }
    return newItem;
  });
}

export function AntdDropdown(
  props: Omit<React.ComponentProps<typeof Dropdown>, "menu" | "overlay"> & {
    onAction?: (key: string) => void;
    menuItems?: () => React.ReactNode;
    useMenuItemsSlot?: boolean;
    menuItemsJson?: React.ComponentProps<typeof Menu>["items"];
    trigger?: "click" | "hover" | "contextMenu";
    dropdownMenuScopeClassName?: string;
  }
) {
  const {
    children,
    onAction,
    menuItems,
    useMenuItemsSlot = false,
    menuItemsJson: unkeyedMenuItems,
    trigger = "click",
    dropdownMenuScopeClassName,
    ...rest
  } = props;

  const keyedMenuItems = addKeysToUnkeyedMenuItems(unkeyedMenuItems);

  return (
    <Dropdown
      {...rest}
      trigger={[trigger]}
      overlay={() => {
        const itemsChildren = useMenuItemsSlot
          ? menuItems?.() ?? []
          : undefined;
        const items = useMenuItemsSlot ? undefined : keyedMenuItems;
        return (
          <Menu
            className={`${dropdownMenuScopeClassName}`}
            onClick={(event) => onAction?.(event.key)}
            items={items}
          >
            {itemsChildren}
          </Menu>
        );
      }}
    >
      {typeof children === "string" ? <div>{children}</div> : children}
    </Dropdown>
  );
}

/**
 * Note that we don't yet support the simpler `items` prop for configuration.
 */
export function registerDropdown(loader?: Registerable) {
  registerComponentHelper(loader, AntdDropdown, {
    name: "plasmic-antd5-dropdown",
    displayName: "Dropdown",
    props: {
      menuItems: {
        type: "slot",
        displayName: "Menu items",
        hidden: (ps) => !ps.useMenuItemsSlot,
        allowedComponents: [
          "plasmic-antd5-menu-item",
          "plasmic-antd5-menu-item-group",
          "plasmic-antd5-menu-divider",
          "plasmic-antd5-submenu",
        ],
        defaultValue: [
          {
            type: "component",
            name: "plasmic-antd5-menu-item",
            props: {
              key: "menu-item-1",
            },
          },
          {
            type: "component",
            name: "plasmic-antd5-menu-item",
            props: {
              key: "menu-item-2",
            },
          },
        ],
        renderPropParams: [],
      },
      menuItemsJson: {
        type: "array",
        displayName: "Menu Items",
        hidden: (ps) => !!ps.useMenuItemsSlot,
        itemType: UNKEYED_MENU_ITEM_TYPE as any,
        defaultValue: [
          {
            type: "item",
            value: "action1",
            label: "Action 1",
          },
          {
            type: "item",
            value: "action2",
            label: "Action 2",
          },
        ],
      },
      dropdownMenuScopeClassName: {
        type: "styleScopeClass",
        scopeName: "dropdownMenu",
      } as any,
      menuClassName: {
        type: "class",
        displayName: "Menu",
        selectors: [
          {
            selector: ":dropdownMenu.ant-dropdown-menu",
            label: "Base",
          },
        ],
      },
      menuItemClassName: {
        type: "class",
        displayName: "Menu item",
        selectors: [
          {
            selector: ":dropdownMenu.ant-dropdown-menu .ant-dropdown-menu-item",
            label: "Base",
          },
          {
            selector:
              ":dropdownMenu.ant-dropdown-menu .ant-dropdown-menu-item-active",
            label: "Focused",
          },
        ],
      },
      open: {
        type: "boolean",
        description: "Toggle visibility of dropdown menu in Plasmic Editor",
        editOnly: true,
        uncontrolledProp: "fakeOpen",
        defaultValueHint: false,
      },
      disabled: {
        type: "boolean",
        description: "Whether the dropdown menu is disabled",
        defaultValueHint: false,
      },
      placement: {
        type: "choice",
        options: [
          "bottomLeft",
          "bottomCenter",
          "bottomRight",
          "topLeft",
          "topCenter",
          "topRight",
        ],
        description: "Placement of popup menu",
        defaultValueHint: "bottomLeft",
        advanced: true,
      },
      trigger: {
        type: "choice",
        options: [
          { value: "click", label: "Click" },
          { value: "hover", label: "Hover" },
          { value: "contextMenu", label: "Right-click" },
        ],
        description: "The trigger mode which executes the dropdown action",
        defaultValueHint: "click",
      },
      useMenuItemsSlot: {
        type: "boolean",
        displayName: "Use menu items slot",
        advanced: true,
        description:
          "Instead of configuring a list of menu items, build the menu items using MenuItem elements. This gives you greater control over item styling.",
      },
      children: {
        type: "slot",
        defaultValue: [
          {
            type: "component",
            name: "plasmic-antd5-button",
            props: {
              children: {
                type: "text",
                value: "Dropdown",
              },
            },
          },
        ],
        ...({ mergeWithParent: true } as any),
      },
      onAction: {
        type: "eventHandler",
        argTypes: [{ name: "key", type: "string" }],
      } as any,
    },
    importPath: "@plasmicpkgs/antd5/skinny/registerDropdown",
    importName: "AntdDropdown",
  });
}
