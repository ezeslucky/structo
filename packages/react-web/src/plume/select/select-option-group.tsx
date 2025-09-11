import { Node } from "@react-types/shared";
import * as React from "react";
import { useListBoxSection } from "@react-aria/listbox";
import { useSeparator } from "@react-aria/separator";
import { pick } from "../../common";
import { Overrides } from "../../render/elements";
import { renderCollectionNode, SectionLikeProps } from "../collection-utils";
import {
  AnyStructoClass,
  mergeVariantToggles,
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

export interface BaseSelectOptionGroupProps
  extends SectionLikeProps,
    StyleProps {}

interface SelectOptionGroupConfig<C extends AnyStructoClass> {
  noTitleVariant: VariantDef<StructoClassVariants<C>>;
  isFirstVariant: VariantDef<StructoClassVariants<C>>;

  optionsSlot: keyof StructoClassArgs<C>;
  titleSlot: keyof StructoClassArgs<C>;

  root: keyof StructoClassOverrides<C>;
  separator: keyof StructoClassOverrides<C>;
  titleContainer: keyof StructoClassOverrides<C>;
  optionsContainer: keyof StructoClassOverrides<C>;
}

export function useSelectOptionGroup<
  P extends BaseSelectOptionGroupProps,
  C extends AnyStructoClass
>(structoClass: C, props: P, config: SelectOptionGroupConfig<C>) {
  const state = React.useContext(SelectContext);

  // `node` should exist if the OptionGroup was instantiated properly
  // within a Select
  const node = (props as any)._node as
    | Node<React.ReactElement<BaseSelectOptionGroupProps>>
    | undefined;

  if (!state || !node) {
    if (PLUME_STRICT_MODE) {
      throw new Error(
        "You can only use a Select.OptionGroup within a Select component."
      );
    }
    return getDefaultStructoProps(structoClass, props);
  }

  const { headingProps, groupProps } = useListBoxSection({
    heading: props.title,
    "aria-label": props["aria-label"],
  });

  const { separatorProps } = useSeparator({
    elementType: "li",
  });

  const variants = {
    ...pick(props, ...structoClass.internalVariantProps),
    ...mergeVariantToggles(
      { def: config.noTitleVariant, active: !props.title },
      {
        def: config.isFirstVariant,
        active: state.collection.getFirstKey() === node.key,
      }
    ),
  };

  const args = {
    ...pick(props, ...structoClass.internalArgProps),
    [config.titleSlot]: props.title,
    [config.optionsSlot]: Array.from(node.childNodes).map((childNode) =>
      renderCollectionNode(childNode)
    ),
  };

  const overrides: Overrides = {
    [config.root]: {
      props: getStyleProps(props),
    },
    [config.separator]: {
      props: {
        ...separatorProps,
      },
    },
    [config.titleContainer]: {
      props: {
        role: "presentation",
        ...headingProps,
      },
      ...(!props.title && {
        render: () => null,
      }),
    },
    [config.optionsContainer]: {
      props: {
        ...groupProps,
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
