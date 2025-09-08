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
import { Fetcher } from "@plasmicapp/react-web/lib/data-sources";

import { useScreenVariants as useScreenVariantsscBjPxgdxdzbv } from "./StructoGlobalVariant__Screen"; // plasmic-import: SCBjPXGDXDZBV/globalVariant

import globalcss from "@plasmicapp/react-web/lib/plasmic.css?url";
import defaultcss from "../plasmic__default_style.css?url"; // plasmic-import: global/defaultcss

import projectcss from "./plasmic.css?url"; // plasmic-import: 47tFXWjN2C4NyHFGGpaYQ3/projectcss
import sty from "./StructoHomepage.css?url"; // plasmic-import: 6uuAAE1jiCew/css

createStructoElementProxy;

export type StructoHomepage__VariantMembers = {};
export type StructoHomepage__VariantsArgs = {};
type VariantPropType = keyof StructoHomepage__VariantsArgs;
export const StructoHomepage__VariantProps = new Array<VariantPropType>();

export type StructoHomepage__ArgsType = {};
type ArgPropType = keyof StructoHomepage__ArgsType;
export const StructoHomepage__ArgProps = new Array<ArgPropType>();

export type StructoHomepage__OverridesType = {
  root?: Flex__<"div">;
  section?: Flex__<"section">;
  h1?: Flex__<"h1">;
  text?: Flex__<"div">;
  randomDynamicPageButton?: Flex__<typeof RandomDynamicPageButton>;
};

export interface DefaultHomepageProps {}

const $$ = {};

function useTanStackRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function StructoHomepage__RenderFunc(props: {
  variants: StructoHomepage__VariantsArgs;
  args: StructoHomepage__ArgsType;
  overrides: StructoHomepage__OverridesType;
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

  const globalVariants = ensureGlobalVariants({
    screen: useScreenVariantsscBjPxgdxdzbv()
  });

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
            "Homepage__root__qtZIr"
          )}
        >
          <section
            data-plasmic-name={"section"}
            data-plasmic-override={overrides.section}
            className={classNames(
              "plasmic_default__all",
              "plasmic_default__section",
              "Homepage__section__pXQ"
            )}
          >
            <h1
              data-plasmic-name={"h1"}
              data-plasmic-override={overrides.h1}
              className={classNames(
                "plasmic_default__all",
                "plasmic_default__h1",
                "__wab_text",
                "Homepage__h1__equfk"
              )}
            >
              {"create-plasmic-app"}
            </h1>
            <div
              data-plasmic-name={"text"}
              data-plasmic-override={overrides.text}
              className={classNames(
                "plasmic_default__all",
                "plasmic_default__div",
                "__wab_text",
                "Homepage__text__aC4Gm"
              )}
            >
              {hasVariant(globalVariants, "screen", "desktopOnly") ? (
                <React.Fragment>
                  <React.Fragment>
                    {
                      "This project is used by run-cpa.ts in the create-plasmic-app repo.\n\nrun-cpa.ts runs create-plasmic-app for many combinations of args (e.g. nextjs + appDir + loader + typescript) to check for changes in generated files. Any changes to this project will result in lots of changes to the generated files. "
                    }
                  </React.Fragment>
                  <span
                    className={"plasmic_default__all plasmic_default__span"}
                    style={{ fontWeight: 700 }}
                  >
                    {"Therefore, please avoid changing this project."}
                  </span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <React.Fragment>
                    {
                      "If you haven't already done so, go back and learn the basics by going through the Structo Levels tutorial.\n\nIt's always easier to start from examples! Add a new page using a template\u2014do this from the list of pages in the top left (the gray + button).\n\nOr press the big blue + button to start dragging items into this page.\n\nIntegrate this project into your codebase\u2014press the "
                    }
                  </React.Fragment>
                  <span
                    className={"plasmic_default__all plasmic_default__span"}
                    style={{ fontWeight: 700 }}
                  >
                    {"Code"}
                  </span>
                  <React.Fragment>
                    {
                      " button in the top right and follow the quickstart instructions.\n\nJoin our Slack community (icon in bottom left) for help any time."
                    }
                  </React.Fragment>
                </React.Fragment>
              )}
            </div>
            <RandomDynamicPageButton
              data-plasmic-name={"randomDynamicPageButton"}
              data-plasmic-override={overrides.randomDynamicPageButton}
              className={classNames(
                "__wab_instance",
                "Homepage__randomDynamicPageButton__y0MM"
              )}
            />
          </section>
        </div>
      </div>
    </React.Fragment>
  ) as React.ReactElement | null;
}

const StructoDescendants = {
  root: ["root", "section", "h1", "text", "randomDynamicPageButton"],
  section: ["section", "h1", "text", "randomDynamicPageButton"],
  h1: ["h1"],
  text: ["text"],
  randomDynamicPageButton: ["randomDynamicPageButton"]
} as const;
type NodeNameType = keyof typeof StructoDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof StructoDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  section: "section";
  h1: "h1";
  text: "div";
  randomDynamicPageButton: typeof RandomDynamicPageButton;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  StructoHomepage__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: StructoHomepage__VariantsArgs;
    args?: StructoHomepage__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<StructoHomepage__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    // Specify args directly as props
    Omit<StructoHomepage__ArgsType, ReservedPropsType> &
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
          internalArgPropNames: StructoHomepage__ArgProps,
          internalVariantPropNames: StructoHomepage__VariantProps
        }),
      [props, nodeName]
    );
    return StructoHomepage__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "StructoHomepage";
  } else {
    func.displayName = `StructoHomepage.${nodeName}`;
  }
  return func;
}

export const StructoHomepage = Object.assign(
  // Top-level PlasmicHomepage renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    section: makeNodeComponent("section"),
    h1: makeNodeComponent("h1"),
    text: makeNodeComponent("text"),
    randomDynamicPageButton: makeNodeComponent("randomDynamicPageButton"),

    // Metadata about props expected for PlasmicHomepage
    internalVariantProps: StructoHomepage__VariantProps,
    internalArgProps: StructoHomepage__ArgProps,

    // Page metadata
    pageMetadata: {
      title: "",
      description: "",
      ogImageSrc: "",
      canonical: ""
    }
  }
);

export const StructoHomepage__HeadOptions = {
  meta: [{ name: "twitter:card", content: "summary" }],

  links: [
    { rel: "stylesheet", href: globalcss },
    { rel: "stylesheet", href: defaultcss },
    { rel: "stylesheet", href: projectcss },
    { rel: "stylesheet", href: sty }
  ]
} as Record<"meta" | "links", Array<Record<string, string>>>;

export default StructoHomepage;
/* prettier-ignore-end */
