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
} from "@plasmicapp/react-web";
import {
  DataCtxReader as DataCtxReader__,
  useDataEnv,
  useGlobalActions
} from "@plasmicapp/react-web/lib/host";

import RandomDynamicPageButton from "../../RandomDynamicPageButton"; // plasmic-import: Q23H1_1M_P/component

import globalcss from "@plasmicapp/react-web/lib/plasmic.css?url";
import defaultcss from "../plasmic__default_style.css?url"; // plasmic-import: global/defaultcss

import projectcss from "./plasmic.css?url"; // plasmic-import: 47tFXWjN2C4NyHFGGpaYQ3/projectcss
import sty from "./StructoDynamicPage.css?url"; // plasmic-import: AO44A-w7hh/css

createStructoElementProxy;

export type StructoDynamicPage__VariantMembers = {};
export type StructoDynamicPage__VariantsArgs = {};
type VariantPropType = keyof StructoDynamicPage__VariantsArgs;
export const StructoDynamicPage__VariantProps = new Array<VariantPropType>();

export type StructoDynamicPage__ArgsType = {};
type ArgPropType = keyof StructoDynamicPage__ArgsType;
export const StructoDynamicPage__ArgProps = new Array<ArgPropType>();

export type StructoDynamicPage__OverridesType = {
  root?: Flex__<"div">;
  section?: Flex__<"section">;
  h1?: Flex__<"h1">;
  randomDynamicPageButton?: Flex__<typeof RandomDynamicPageButton>;
};

export interface DefaultDynamicPageProps {}

const $$ = {};

function useTanStackRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function StructoDynamicPage__RenderFunc(props: {
  variants: StructoDynamicPage__VariantsArgs;
  args: StructoDynamicPage__ArgsType;
  overrides: StructoDynamicPage__OverridesType;
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
    <React.Fragment>
      <style>{`
        body {
          margin: 0;
        }
      `}</style>

      <div className={"plasmic_page_wrapper"}>
        <div
          data-plasmic-name={"root"}
          data-plasmic-override={overrides.root}
          data-plasmic-root={true}
          data-plasmic-for-node={forNode}
          className={classNames(
            "plasmic_default__all",
            "plasmic_default__div",
            "root_reset_47tFXWjN2C4NyHFGGpaYQ3",
            "plasmic_default_styles",
            "plasmic_mixins",
            "plasmic_tokens",
            "DynamicPage__root__hgzte"
          )}
        >
          <section
            data-plasmic-name={"section"}
            data-plasmic-override={overrides.section}
            className={classNames(
              "plasmic_default__all",
              "plasmic_default__section",
              "DynamicPage__section__mbqxB"
            )}
          >
            <h1
              data-plasmic-name={"h1"}
              data-plasmic-override={overrides.h1}
              className={classNames(
                "plasmic_default__all",
                "plasmic_default__h1",
                "__wab_text",
                "DynamicPage__h1__uyAe1"
              )}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return $ctx.params.slug;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "StructoUndefinedDataError"
                    ) {
                      return "Page 1";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </h1>
            <RandomDynamicPageButton
              data-plasmic-name={"randomDynamicPageButton"}
              data-plasmic-override={overrides.randomDynamicPageButton}
              className={classNames(
                "__wab_instance",
                "DynamicPage__randomDynamicPageButton__kaCiI"
              )}
            />
          </section>
        </div>
      </div>
    </React.Fragment>
  ) as React.ReactElement | null;
}

const StructoDescendants = {
  root: ["root", "section", "h1", "randomDynamicPageButton"],
  section: ["section", "h1", "randomDynamicPageButton"],
  h1: ["h1"],
  randomDynamicPageButton: ["randomDynamicPageButton"]
} as const;
type NodeNameType = keyof typeof StructoDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof StructoDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  section: "section";
  h1: "h1";
  randomDynamicPageButton: typeof RandomDynamicPageButton;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  StructoDynamicPage__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: StructoDynamicPage__VariantsArgs;
    args?: StructoDynamicPage__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<StructoDynamicPage__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    // Specify args directly as props
    Omit<StructoDynamicPage__ArgsType, ReservedPropsType> &
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
          internalArgPropNames: StructoDynamicPage__ArgProps,
          internalVariantPropNames: StructoDynamicPage__VariantProps
        }),
      [props, nodeName]
    );
    return StructoDynamicPage__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "StructoDynamicPage";
  } else {
    func.displayName = `StructoDynamicPage.${nodeName}`;
  }
  return func;
}

export const StructoDynamicPage = Object.assign(
  // Top-level PlasmicDynamicPage renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    section: makeNodeComponent("section"),
    h1: makeNodeComponent("h1"),
    randomDynamicPageButton: makeNodeComponent("randomDynamicPageButton"),

    // Metadata about props expected for PlasmicDynamicPage
    internalVariantProps: StructoDynamicPage__VariantProps,
    internalArgProps: StructoDynamicPage__ArgProps,

    // Page metadata
    pageMetadata: {
      title: "",
      description: "",
      ogImageSrc: "",
      canonical: ""
    }
  }
);

export const StructoDynamicPage__HeadOptions = {
  meta: [{ name: "twitter:card", content: "summary" }],

  links: [
    { rel: "stylesheet", href: globalcss },
    { rel: "stylesheet", href: defaultcss },
    { rel: "stylesheet", href: projectcss },
    { rel: "stylesheet", href: sty }
  ]
} as Record<"meta" | "links", Array<Record<string, string>>>;

export default StructoDynamicPage;
/* prettier-ignore-end */
