/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */



import * as React from "react";

import { useRouter, Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";

import {
  Flex as Flex__,
  MultiChoiceArg,
  StructoDataSourceContextProvider as StructoDataSourceContextProvider__,
  StructoIcon as StructoIcon__,
  StructoImg as StructoImg__,
  StructoLink as StructoLink__,
  StructoPageGuard as StructoPageGuard__,
  SingleBooleanChoiceArg,
  SingleChoiceArg,
  Stack as Stack__,
  StrictProps,
  Trans as Trans__,
  classNames,
  createStructoElementProxy,
  deriveRenderOpts,
  ensureGlobalVariants,
  generateOnMutateForSpec,
  generateStateOnChangeProp,
  generateStateOnChangePropForCodeComponents,
  generateStateValueProp,
  get as $stateGet,
  hasVariant,
  initializeCodeComponentStates,
  initializeStructoStates,
  makeFragment,
  omit,
  pick,
  renderStructoSlot,
  set as $stateSet,
  useCurrentUser,
  useDollarState,
  useStructoTranslator,
  useTrigger,
  wrapWithClassName
} from "@structoapp/react-web";
import {
  DataCtxReader as DataCtxReader__,
  useDataEnv,
  useGlobalActions
} from "@structoapp/react-web/lib/host";

import Button from "../../Button"; // structo-import: TQcvW_pSKi3/component

import globalcss from "@structoapp/react-web/lib/structo.css?url";
import defaultcss from "../structo__default_style.css?url"; // structo-import: global/defaultcss

import projectcss from "./structo.css?url"; // structo-import: 47tFXWjN2C4NyHFGGpaYQ3/projectcss
import sty from "./StructoRandomDynamicPageButton.css?url"; // structo-import: Q23H1_1M_P/css

import CheckSvgIcon from "./icons/StructoIcon__CheckSvg"; // structo-import: gj-_D7n31Ho/icon
import IconIcon from "./icons/StructoIcon__Icon"; // structo-import: 6PNxx3YMyDQ/icon

createStructoElementProxy;

export type StructoRandomDynamicPageButton__VariantMembers = {};
export type StructoRandomDynamicPageButton__VariantsArgs = {};
type VariantPropType = keyof StructoRandomDynamicPageButton__VariantsArgs;
export const StructoRandomDynamicPageButton__VariantProps =
  new Array<VariantPropType>();

export type StructoRandomDynamicPageButton__ArgsType = {};
type ArgPropType = keyof StructoRandomDynamicPageButton__ArgsType;
export const StructoRandomDynamicPageButton__ArgProps =
  new Array<ArgPropType>();

export type StructoRandomDynamicPageButton__OverridesType = {
  root?: Flex__<typeof Button>;
};

export interface DefaultRandomDynamicPageButtonProps {
  className?: string;
}

const $$ = {};

function useTanStackRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function StructoRandomDynamicPageButton__RenderFunc(props: {
  variants: StructoRandomDynamicPageButton__VariantsArgs;
  args: StructoRandomDynamicPageButton__ArgsType;
  overrides: StructoRandomDynamicPageButton__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {},
        Object.fromEntries(
          Object.entries(props.args).filter(([_, v]) => v !== undefined)
        )
      ),
    [props.args]
  );

  const $props = {
    ...args,
    ...variants
  };

  const __tanstackRouter = useTanStackRouter();
  const $ctx = useDataEnv?.() || {};
  const refsRef = React.useRef({});
  const $refs = refsRef.current;

  return (
    <Button
      data-structo-name={"root"}
      data-structo-override={overrides.root}
      data-structo-root={true}
      data-structo-for-node={forNode}
      className={classNames(
        "__wab_instance",
        "RandomDynamicPageButton__root__yStMk"
      )}
      onClick={async event => {
        const $steps = {};

        $steps["goToDynamicPage"] = true
          ? (() => {
              const actionArgs = {
                destination: `/dynamic/${(() => {
                  try {
                    return Math.random().toString(36).slice(2);
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.structoType === "StructoUndefinedDataError"
                    ) {
                      return "value";
                    }
                    throw e;
                  }
                })()}`
              };
              return (({ destination }) => {
                if (
                  typeof destination === "string" &&
                  destination.startsWith("#")
                ) {
                  document
                    .getElementById(destination.substr(1))
                    .scrollIntoView({ behavior: "smooth" });
                } else {
                  location.assign(destination);
                }
              })?.apply(null, [actionArgs]);
            })()
          : undefined;
        if (
          $steps["goToDynamicPage"] != null &&
          typeof $steps["goToDynamicPage"] === "object" &&
          typeof $steps["goToDynamicPage"].then === "function"
        ) {
          $steps["goToDynamicPage"] = await $steps["goToDynamicPage"];
        }
      }}
      submitsForm={true}
    >
      {"Random Dynamic Page"}
    </Button>
  ) as React.ReactElement | null;
}

const StructoDescendants = {
  root: ["root"]
} as const;
type NodeNameType = keyof typeof StructoDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof StructoDescendants)[T][number];
type NodeDefaultElementType = {
  root: typeof Button;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  StructoRandomDynamicPageButton__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: StructoRandomDynamicPageButton__VariantsArgs;
    args?: StructoRandomDynamicPageButton__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<StructoRandomDynamicPageButton__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    // Specify args directly as props
    Omit<StructoRandomDynamicPageButton__ArgsType, ReservedPropsType> &
    // Specify overrides for each element directly as props
    Omit<
      NodeOverridesType<T>,
      ReservedPropsType | VariantPropType | ArgPropType
    > &
    // Specify props for the root element
    Omit<
      Partial<React.ComponentProps<NodeDefaultElementType[T]>>,
      ReservedPropsType | VariantPropType | ArgPropType | DescendantsType<T>
    >;

function makeNodeComponent<NodeName extends NodeNameType>(nodeName: NodeName) {
  type PropsType = NodeComponentProps<NodeName> & { key?: React.Key };
  const func = function <T extends PropsType>(
    props: T & StrictProps<T, PropsType>
  ) {
    const { variants, args, overrides } = React.useMemo(
      () =>
        deriveRenderOpts(props, {
          name: nodeName,
          descendantNames: StructoDescendants[nodeName],
          internalArgPropNames: StructoRandomDynamicPageButton__ArgProps,
          internalVariantPropNames: StructoRandomDynamicPageButton__VariantProps
        }),
      [props, nodeName]
    );
    return StructoRandomDynamicPageButton__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "StructoRandomDynamicPageButton";
  } else {
    func.displayName = `StructoRandomDynamicPageButton.${nodeName}`;
  }
  return func;
}

export const StructoRandomDynamicPageButton = Object.assign(
  // Top-level structoRandomDynamicPageButton renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements

    // Metadata about props expected for structoRandomDynamicPageButton
    internalVariantProps: StructoRandomDynamicPageButton__VariantProps,
    internalArgProps: StructoRandomDynamicPageButton__ArgProps
  }
);

export const StructoRandomDynamicPageButton__HeadOptions = {
  meta: [{ name: "twitter:card", content: "summary" }],

  links: [
    { rel: "stylesheet", href: globalcss },
    { rel: "stylesheet", href: defaultcss },
    { rel: "stylesheet", href: projectcss },
    { rel: "stylesheet", href: sty }
  ]
} as Record<"meta" | "links", Array<Record<string, string>>>;

export default StructoRandomDynamicPageButton;
/* prettier-ignore-end */
