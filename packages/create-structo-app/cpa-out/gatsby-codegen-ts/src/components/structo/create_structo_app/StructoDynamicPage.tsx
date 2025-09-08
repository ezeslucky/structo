/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */



import * as React from "react";

import {
  Link,
  GatsbyLinkProps as LinkProps,
  navigate as __gatsbyNavigate
} from "gatsby";

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

import RandomDynamicPageButton from "../../RandomDynamicPageButton"; // structo-import: Q23H1_1M_P/component

import "@structoapp/react-web/lib/structo.css";

import * as projectcss from "./structo.module.css"; // structo-import: 47tFXWjN2C4NyHFGGpaYQ3/projectcss
import * as sty from "./StructoDynamicPage.module.css"; // structo-import: AO44A-w7hh/css
// structo-import: AO44A-w7hh/css

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

export interface DefaultDynamicPageProps {
  className?: string;
}

const $$ = {};

export function Head() {
  return <></>;
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

      <div className={projectcss.structo_page_wrapper}>
        <div
          data-structo-name={"root"}
          data-structo-override={overrides.root}
          data-structo-root={true}
          data-structo-for-node={forNode}
          className={classNames(
            projectcss.all,
            projectcss.root_reset,
            projectcss.structo_default_styles,
            projectcss.structo_mixins,
            projectcss.structo_tokens,
            sty.root
          )}
        >
          <section
            data-structo-name={"section"}
            data-structo-override={overrides.section}
            className={classNames(projectcss.all, sty.section)}
          >
            <h1
              data-structo-name={"h1"}
              data-structo-override={overrides.h1}
              className={classNames(
                projectcss.all,
                projectcss.h1,
                projectcss.__wab_text,
                sty.h1
              )}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return $ctx.params.slug;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.structoType === "StructoUndefinedDataError"
                    ) {
                      return "Page 1";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </h1>
            <RandomDynamicPageButton
              data-structo-name={"randomDynamicPageButton"}
              data-structo-override={overrides.randomDynamicPageButton}
              className={classNames(
                "__wab_instance",
                sty.randomDynamicPageButton
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
  // Top-level structoDynamicPage renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    section: makeNodeComponent("section"),
    h1: makeNodeComponent("h1"),
    randomDynamicPageButton: makeNodeComponent("randomDynamicPageButton"),

    // Metadata about props expected for structoDynamicPage
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

export default StructoDynamicPage;
/* prettier-ignore-end */
