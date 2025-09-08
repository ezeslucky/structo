/**
 * In general, we try not to expose react-aria's Collections API to Plume users.
 * The Collections API is how react-aria users pass data about collections of
 * things using the built-in Item and Section components, which are abstract,
 * metadata-only components that don't render anything but only serve to specify
 * data.  For example, here's how you would use react-spectrum's Picker:
 *
 *   <Picker>
 *     <Section title="Asia">
 *       <Item key="taiwan">Taiwan</Item>
 *       <Item key="japan">Japan</Item>
 *       <Item key="china">China</Item>
 *     </Section>
 *     <Section title="Europe">
 *       <Item key="germany">Germany</Item>
 *       <Item key="france">France</Item>
 *     </Section>
 *   </Picker>
 *
 * You would re-use this same Item/Section components to pass similar things to
 * Menu, Tabs, etc.
 *
 * For Plasmic, this API is too abstract.  The user has explicitly designed components
 * like Select.Option and Select.OptionGroup, and it is weird that they don't actually
 * use these components. It is more natural to do:
 *
 *   <Select>
 *     <Select.OptionGroup title="Asia">
 *       <Select.Option key="taiwan">Taiwan</Select>
 *     </Select.OptionGroup>
 *   </Select>
 *
 * For Plume, we let users directly use the components they designed, both to collect
 * information and to perform actual rendering.  For example, for Plume,
 * you'd use Select.Option instead of Item, and Select.OptionGroup instead of Section.
 * This means that the Select.Option props will collect the same information Item
 * does.
 *
 * A component like Select.Option then serves two purposes:
 *
 * 1. Allow users to specify the collection of data, like in the above example
 *    Here, we're mainly interested in the props in those ReactElements so
 *    we can pass the Item/Section data onto react-aria's APIs.  We are not
 *    actually rendering these elements.
 * 2. Once react-aria's Collections API has gone through them and built
 *    Collection "nodes", we then create cloned versions of these elements
 *    with the corresponding node passed in as a secret prop.  These ReactElements
 *    are then actually used to _render_ the corresponding Option / OptionGroup.
 *
 * This file contains helper functions to help with implementing the above.
 *
 * Note also that most of the collections-based react-aria components expose
 * a parallel API that accepts a list of "items" and a render prop, instead
 * of list of Item/Section elements.  This is for efficiency, but we are opting
 * to only support the composite-component pattern for now for simplicity.
 */

import { Item, Section } from "@react-stately/collections";
import { Node } from "@react-types/shared";
import React from "react";
import { isString } from "../common";
import { getElementTypeName, toChildArray } from "../react-utils";
import { getPlumeType, PLUME_STRICT_MODE } from "./plume-utils";

export interface PlasmicLoaderProps<T> {
  component: string;
  componentProps: T;
}

/**
 * Props for a Plume component that corresponds to an Item
 */
export interface ItemLikeProps {
  /**
   * value key corresponding to this item. Not required if you use the
   * `key` prop instead.
   */
  value?: string | null;

  /**
   * The text string value corresponding to this item. Used to support
   * keyboard type-ahead.  If not specified, then will be derived from
   * `children` if it is a string, or the `value` or `key`.
   */
  textValue?: string;

  /**
   * aria-label for this item.
   */
  "aria-label"?: string;

  /**
   * Primary content label for this item.
   */
  children?: React.ReactNode;

  /**
   * If true, this item will not be selectable.
   */
  isDisabled?: boolean;
}

type LoaderAwareItemLikeProps =
  | ItemLikeProps
  | PlasmicLoaderProps<ItemLikeProps>;

/**
 * Props for a Plume component that corresponds to a Section
 */
export interface SectionLikeProps {
  /**
   * Heading content of the title
   */
  title?: React.ReactNode;

  /**
   * aria-label for this section
   */
  "aria-label"?: string;

  /**
   * A list of items that belong in this group
   */
  children?: React.ReactNode;
}

type LoaderAwareSectionLikeProps =
  | SectionLikeProps
  | PlasmicLoaderProps<SectionLikeProps>;

export type ItemJson = LeafItemJson | SectionJson;

export type LeafItemJson =
  | string
  | {
      value: string;
      label?: string;
      textValue?: string;
      isDisabled?: boolean;
    };

export interface SectionJson {
  title: string;
  children: ItemJson[];
}

export function deriveItemsFromProps(
  props: any,
  opts: {
    itemPlumeType: string;
    sectionPlumeType?: string;
    invalidChildError?: string;
    requireItemValue: boolean;
    ItemComponent?: React.ComponentType<ItemLikeProps>;
    SectionComponent?: React.ComponentType<SectionLikeProps>;
    itemsProp?: string;
  }
) {
  if (opts.itemsProp && opts.itemsProp in props) {
    if (!opts.ItemComponent || !opts.SectionComponent) {
      throw new Error(`You may need to re-generate your Plasmic* files`);
    }
    const items = props[opts.itemsProp] as ItemJson[] | undefined;
    return deriveItemsFromItemsProp(items, {
      ItemComponent: opts.ItemComponent,
      SectionComponent: opts.SectionComponent,
    });
  } else {
    return deriveItemsFromChildren(props.children as React.ReactNode, opts);
  }
}

function deriveItemsFromItemsProp(
  items: ItemJson[] | undefined,
  opts: {
    ItemComponent: React.ComponentType<ItemLikeProps>;
    SectionComponent: React.ComponentType<SectionLikeProps>;
  }
) {
  const { ItemComponent, SectionComponent } = opts;
  const disabledKeys: string[] = [];
  const transform = (item: ItemJson) => {
    if (typeof item === "string") {
      return (
        <ItemComponent key={item} value={item}>
          {item}
        </ItemComponent>
      );
    } else if ("children" in item) {
      return (
        <SectionComponent key={item.title} title={item.title}>
          {item.children.map((x) => transform(x))}
        </SectionComponent>
      );
    } else {
      if (item.isDisabled) {
        disabledKeys.push(item.value);
      }
      return (
        <ItemComponent
          key={item.value}
          value={item.value}
          textValue={item.textValue}
          isDisabled={item.isDisabled}
        >
          {item.label ?? item.value}
        </ItemComponent>
      );
    }
  };
  return {
    items: items?.map((x) => transform(x)) ?? [],
    disabledKeys,
  };
}

/**
 * Given children of a component like Select or Menu, derive the items
 * that we will pass into the Collections API.  These will be
 * ReactElement<ItemLikeProps|SectionLikeProps>[].
 *
 * Will also assign keys to items by their index in the collection,
 * and collect the keys of disabled items.
 */
export function deriveItemsFromChildren<T extends React.ReactElement>(
  children: React.ReactNode,
  opts: {
    itemPlumeType: string;
    sectionPlumeType?: string;
    invalidChildError?: string;
    requireItemValue: boolean;
  }
) {
  if (!children) {
    return {
      items: [] as T[],
      disabledKeys: [] as React.Key[],
    };
  }

  const { itemPlumeType, sectionPlumeType, invalidChildError } = opts;

  // For Plume items without an explicit key, we assign a key as the index
  // of the collection.
  let itemCount = 0;
  let sectionCount = 0;

  const ensureValue = (element: React.ReactElement) => {
    if (!propInChild(element, "value")) {
      if (opts.requireItemValue && PLUME_STRICT_MODE) {
        throw new Error(
          `Must specify a "value" prop for ${getElementTypeName(element)}`
        );
      } else {
        return cloneChild(element, { value: `${itemCount++}` });
      }
    } else {
      // Still increment count even if key is present, so that the
      // auto-assigned key really reflects the index
      itemCount++;
      return element;
    }
  };

  const disabledKeys: React.Key[] = [];

  const flattenedChildren = (
    children: React.ReactNode
  ): React.ReactElement[] => {
    return toChildArray(children).flatMap((child) => {
      if (React.isValidElement(child)) {
        if (child.type === React.Fragment) {
          return flattenedChildren(
            (child as React.ReactElement<{ children: React.ReactNode }>).props
              .children
          );
        }
        const type = getPlumeType(child);
        if (type === itemPlumeType) {
          child = ensureValue(child);
          const childKey = getItemLikeKey(child);
          if (getChildProp(child, "isDisabled") && !!childKey) {
            disabledKeys.push(childKey);
          }
          return [child];
        }
        if (type === sectionPlumeType) {
          return [
            cloneChild(child, {
              // key of section doesn't actually matter, just needs
              // to be unique
              key: child.key ?? `section-${sectionCount++}`,
              children: flattenedChildren(getChildProp(child, "children")),
            }),
          ];
        }
      }

      if (PLUME_STRICT_MODE) {
        throw new Error(invalidChildError ?? `Unexpected child`);
      } else {
        return [];
      }
    });
  };

  return { items: flattenedChildren(children) as T[], disabledKeys };
}

export function useDerivedItems(
  props: any,
  opts: {
    itemPlumeType: string;
    sectionPlumeType?: string;
    invalidChildError?: string;
    requireItemValue: boolean;
    ItemComponent?: React.ComponentType<ItemLikeProps>;
    SectionComponent?: React.ComponentType<SectionLikeProps>;
    itemsProp?: string;
  }
) {
  const { children } = props;
  const {
    itemPlumeType,
    sectionPlumeType,
    invalidChildError,
    requireItemValue,
    ItemComponent,
    SectionComponent,
    itemsProp,
  } = opts;
  const items = itemsProp ? props[itemsProp] : undefined;
  return React.useMemo(() => {
    return deriveItemsFromProps(props, {
      itemPlumeType,
      sectionPlumeType,
      invalidChildError,
      requireItemValue,
      itemsProp,
      ItemComponent,
      SectionComponent,
    });
  }, [
    children,
    items,
    itemPlumeType,
    sectionPlumeType,
    invalidChildError,
    requireItemValue,
    ItemComponent,
    SectionComponent,
  ]);
}

export function useDerivedItemsFromChildren<T extends React.ReactElement>(
  children: React.ReactNode,
  opts: {
    itemPlumeType: string;
    sectionPlumeType?: string;
    invalidChildError?: string;
    requireItemValue: boolean;
  }
) {
  const {
    itemPlumeType,
    sectionPlumeType,
    invalidChildError,
    requireItemValue,
  } = opts;
  return React.useMemo(() => {
    return deriveItemsFromChildren<T>(children, {
      itemPlumeType,
      sectionPlumeType,
      invalidChildError,
      requireItemValue,
    });
  }, [
    children,
    itemPlumeType,
    sectionPlumeType,
    invalidChildError,
    requireItemValue,
  ]);
}

/**
 * Given a Collection node, create the React element that we should use
 * to render it.
 */
export function renderCollectionNode(node: Node<any>) {
  // node.rendered should already have our item-like or section-like Plume
  // component elements, so we just need to clone them with a secret
  // _node prop that we use to render.
  return cloneChild(node.rendered as React.ReactElement, {
    _node: node,
    key: node.key,
  });
}

/**
 * Renders a item-like or section-like Plume component element into an
 * Item or a Section element.
 */
export function renderAsCollectionChild<
  T extends React.ReactElement<
    LoaderAwareItemLikeProps | LoaderAwareSectionLikeProps
  >
>(
  child: T,
  opts: {
    itemPlumeType: string;
    sectionPlumeType?: string;
  }
) {
  const plumeType = getPlumeType(child);
  if (plumeType === opts.itemPlumeType) {
    const option = child as React.ReactElement<LoaderAwareItemLikeProps>;

    // We look at the children passed to the item-like element, and derive key
    // or textValue from it if it is a string
    const content = getChildProp(option, "children");

    // The children render prop needs to return an <Item/>
    return (
      <Item
        // We use ItemLike.value if the user explicitly specified a value,
        // and we fallback to key.  If the user specified neither, then
        // the Collections API will generate a unique key for this item.
        key={getItemLikeKey(option)}
        // textValue is either explicitly specified by the user, or we
        // try to derive it if `content` is a string.
        textValue={
          getChildProp(option, "textValue") ??
          (isString(content)
            ? content
            : propInChild(option, "value")
            ? getChildProp(option, "value")
            : option.key)
        }
        aria-label={getChildProp(option, "aria-label")}
      >
        {
          // Note that what we setting the item-like element as the children
          // here, and not content; we want the entire item-like Plume element to
          // end up as Node.rendered.
        }
        {option}
      </Item>
    );
  } else {
    const group = child as React.ReactElement<LoaderAwareSectionLikeProps>;
    return (
      <Section
        // Note that we are using the whole section-like element as the title
        // here, and not group.props.title; we want the entire section-like
        // Plume element to end up as Node.rendered.
        title={group}
        aria-label={getChildProp(group, "aria-label")}
        // We are flattening and deriving the descendant Options as items here.
        // group.props.children should've already been cleaned up by
        // deriveItemsFromChildren()
        items={getChildProp(group, "children") as React.ReactElement[]}
      >
        {
          // We use the same render function to turn descendent Options into Items
        }
        {(c: React.ReactElement) => renderAsCollectionChild(c, opts)}
      </Section>
    );
  }
}

function getItemLikeKey(element: React.ReactElement<LoaderAwareItemLikeProps>) {
  return getChildProp(element, "value") ?? element.key;
}

// PlasmicLoader-aware function to get prop from child.
export function getChildProp(child: React.ReactElement, prop: string) {
  return "componentProps" in child.props
    ? child.props.componentProps[prop]
    : child.props[prop];
}

// PlasmicLoader-aware function to check `if (prop in element.props)`.
function propInChild(child: React.ReactElement, prop: string): boolean {
  return "componentProps" in child.props
    ? prop in child.props.componentProps
    : prop in child.props;
}

// PlasmicLoader-aware function to clone React element.
function cloneChild(child: React.ReactElement, props: Record<string, any>) {
  if ((child.type as any).getPlumeType) {
    // If React element has getPlumeType(), assume that it is PlasmicLoader,
    // so add nodeProps to componentProps instead of element props.
    return React.cloneElement(child, {
      componentProps: {
        ...child.props.componentProps,
        ...props,
      },
      ...(props.key ? { key: props.key } : {}),
    });
  }

  return React.cloneElement(child, props);
}
