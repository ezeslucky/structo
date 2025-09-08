/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */



import * as React from "react";

import Head from "next/head";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

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

import * as pp from "@structoapp/react-web";

import "@structoapp/react-web/lib/structo.css";

import projectcss from "./structo.module.css"; // structo-import: 47tFXWjN2C4NyHFGGpaYQ3/projectcss
import sty from "./StructoButton.module.css"; // structo-import: TQcvW_pSKi3/css

import CheckSvgIcon from "./icons/StructoIcon__CheckSvg"; // structo-import: gj-_D7n31Ho/icon
import IconIcon from "./icons/StructoIcon__Icon"; // structo-import: 6PNxx3YMyDQ/icon

createStructoElementProxy;

export type StructoButton__VariantMembers = {
  showStartIcon: "showStartIcon";
  showEndIcon: "showEndIcon";
  isDisabled: "isDisabled";
  shape: "rounded" | "round" | "sharp";
  size: "compact" | "minimal";
  color:
    | "blue"
    | "green"
    | "yellow"
    | "red"
    | "sand"
    | "white"
    | "softBlue"
    | "softGreen"
    | "softYellow"
    | "softRed"
    | "softSand"
    | "clear"
    | "link";
};
export type StructoButton__VariantsArgs = {
  showStartIcon?: SingleBooleanChoiceArg<"showStartIcon">;
  showEndIcon?: SingleBooleanChoiceArg<"showEndIcon">;
  isDisabled?: SingleBooleanChoiceArg<"isDisabled">;
  shape?: SingleChoiceArg<"rounded" | "round" | "sharp">;
  size?: SingleChoiceArg<"compact" | "minimal">;
  color?: SingleChoiceArg<
    | "blue"
    | "green"
    | "yellow"
    | "red"
    | "sand"
    | "white"
    | "softBlue"
    | "softGreen"
    | "softYellow"
    | "softRed"
    | "softSand"
    | "clear"
    | "link"
  >;
};
type VariantPropType = keyof StructoButton__VariantsArgs;
export const StructoButton__VariantProps = new Array<VariantPropType>(
  "showStartIcon",
  "showEndIcon",
  "isDisabled",
  "shape",
  "size",
  "color"
);

export type StructoButton__ArgsType = {
  link?: string;
  submitsForm?: boolean;
  target?: boolean;
  startIcon?: React.ReactNode;
  children?: React.ReactNode;
  endIcon?: React.ReactNode;
};
type ArgPropType = keyof StructoButton__ArgsType;
export const StructoButton__ArgProps = new Array<ArgPropType>(
  "link",
  "submitsForm",
  "target",
  "startIcon",
  "children",
  "endIcon"
);

export type StructoButton__OverridesType = {
  root?: Flex__<"button">;
  startIconContainer?: Flex__<"div">;
  contentContainer?: Flex__<"div">;
  endIconContainer?: Flex__<"div">;
};

export interface DefaultButtonProps extends pp.BaseButtonProps {
  submitsForm?: boolean;
  target?: boolean;
  shape?: SingleChoiceArg<"rounded" | "round" | "sharp">;
  size?: SingleChoiceArg<"compact" | "minimal">;
  color?: SingleChoiceArg<
    | "blue"
    | "green"
    | "yellow"
    | "red"
    | "sand"
    | "white"
    | "softBlue"
    | "softGreen"
    | "softYellow"
    | "softRed"
    | "softSand"
    | "clear"
    | "link"
  >;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function StructoButton__RenderFunc(props: {
  variants: StructoButton__VariantsArgs;
  args: StructoButton__ArgsType;
  overrides: StructoButton__OverridesType;
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

  const __nextRouter = useNextRouter();

  const $ctx = useDataEnv?.() || {};
  const refsRef = React.useRef({});
  const $refs = refsRef.current;

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "showStartIcon",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.showStartIcon
      },
      {
        path: "showEndIcon",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.showEndIcon
      },
      {
        path: "isDisabled",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.isDisabled
      },
      {
        path: "shape",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.shape
      },
      {
        path: "size",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.size
      },
      {
        path: "color",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.color
      }
    ],
    [$props, $ctx, $refs]
  );
  const $state = useDollarState(stateSpecs, {
    $props,
    $ctx,
    $queries: {},
    $refs
  });

  const [isRootFocusVisibleWithin, triggerRootFocusVisibleWithinProps] =
    useTrigger("useFocusVisibleWithin", {
      isTextInput: false
    });
  const triggers = {
    focusVisibleWithin_root: isRootFocusVisibleWithin
  };

  return (
    <button
      data-structo-name={"root"}
      data-structo-override={overrides.root}
      data-structo-root={true}
      data-structo-for-node={forNode}
      className={classNames(
        projectcss.all,
        projectcss.button,
        projectcss.root_reset,
        projectcss.structo_default_styles,
        projectcss.structo_mixins,
        projectcss.structo_tokens,
        sty.root,
        {
          [sty.root___focusVisibleWithin]: triggers.focusVisibleWithin_root,
          [sty.rootcolor_blue]: hasVariant($state, "color", "blue"),
          [sty.rootcolor_clear]: hasVariant($state, "color", "clear"),
          [sty.rootcolor_green]: hasVariant($state, "color", "green"),
          [sty.rootcolor_link]: hasVariant($state, "color", "link"),
          [sty.rootcolor_link_size_minimal]:
            hasVariant($state, "color", "link") &&
            hasVariant($state, "size", "minimal"),
          [sty.rootcolor_red]: hasVariant($state, "color", "red"),
          [sty.rootcolor_sand]: hasVariant($state, "color", "sand"),
          [sty.rootcolor_softBlue]: hasVariant($state, "color", "softBlue"),
          [sty.rootcolor_softGreen]: hasVariant($state, "color", "softGreen"),
          [sty.rootcolor_softRed]: hasVariant($state, "color", "softRed"),
          [sty.rootcolor_softSand]: hasVariant($state, "color", "softSand"),
          [sty.rootcolor_softYellow]: hasVariant($state, "color", "softYellow"),
          [sty.rootcolor_white]: hasVariant($state, "color", "white"),
          [sty.rootcolor_yellow]: hasVariant($state, "color", "yellow"),
          [sty.rootisDisabled]: hasVariant($state, "isDisabled", "isDisabled"),
          [sty.rootshape_round]: hasVariant($state, "shape", "round"),
          [sty.rootshape_round_size_compact]:
            hasVariant($state, "shape", "round") &&
            hasVariant($state, "size", "compact"),
          [sty.rootshape_rounded]: hasVariant($state, "shape", "rounded"),
          [sty.rootshape_rounded_showStartIcon]:
            hasVariant($state, "shape", "rounded") &&
            hasVariant($state, "showStartIcon", "showStartIcon"),
          [sty.rootshape_rounded_size_compact]:
            hasVariant($state, "size", "compact") &&
            hasVariant($state, "shape", "rounded"),
          [sty.rootshape_sharp]: hasVariant($state, "shape", "sharp"),
          [sty.rootshowEndIcon]: hasVariant(
            $state,
            "showEndIcon",
            "showEndIcon"
          ),
          [sty.rootshowEndIcon_shape_rounded]:
            hasVariant($state, "showEndIcon", "showEndIcon") &&
            hasVariant($state, "shape", "rounded"),
          [sty.rootshowEndIcon_size_compact]:
            hasVariant($state, "size", "compact") &&
            hasVariant($state, "showEndIcon", "showEndIcon"),
          [sty.rootshowEndIcon_size_compact_showStartIcon]:
            hasVariant($state, "size", "compact") &&
            hasVariant($state, "showStartIcon", "showStartIcon") &&
            hasVariant($state, "showEndIcon", "showEndIcon"),
          [sty.rootshowStartIcon]: hasVariant(
            $state,
            "showStartIcon",
            "showStartIcon"
          ),
          [sty.rootsize_compact]: hasVariant($state, "size", "compact"),
          [sty.rootsize_compact_showStartIcon]:
            hasVariant($state, "size", "compact") &&
            hasVariant($state, "showStartIcon", "showStartIcon"),
          [sty.rootsize_minimal]: hasVariant($state, "size", "minimal")
        }
      )}
      data-structo-trigger-props={[triggerRootFocusVisibleWithinProps]}
    >
      {(hasVariant($state, "showStartIcon", "showStartIcon") ? true : false) ? (
        <div
          data-structo-name={"startIconContainer"}
          data-structo-override={overrides.startIconContainer}
          className={classNames(projectcss.all, sty.startIconContainer, {
            [sty.startIconContainercolor_blue]: hasVariant(
              $state,
              "color",
              "blue"
            ),
            [sty.startIconContainershape_rounded_showStartIcon]:
              hasVariant($state, "shape", "rounded") &&
              hasVariant($state, "showStartIcon", "showStartIcon"),
            [sty.startIconContainershowStartIcon]: hasVariant(
              $state,
              "showStartIcon",
              "showStartIcon"
            )
          })}
        >
          {renderStructoSlot({
            defaultContents: (
              <CheckSvgIcon
                className={classNames(projectcss.all, sty.svg__s6Xxe)}
                role={"img"}
              />
            ),

            value: args.startIcon,
            className: classNames(sty.slotTargetStartIcon, {
              [sty.slotTargetStartIconcolor_blue]: hasVariant(
                $state,
                "color",
                "blue"
              ),
              [sty.slotTargetStartIconcolor_clear]: hasVariant(
                $state,
                "color",
                "clear"
              ),
              [sty.slotTargetStartIconcolor_link]: hasVariant(
                $state,
                "color",
                "link"
              ),
              [sty.slotTargetStartIconcolor_softBlue]: hasVariant(
                $state,
                "color",
                "softBlue"
              ),
              [sty.slotTargetStartIconcolor_softGreen]: hasVariant(
                $state,
                "color",
                "softGreen"
              ),
              [sty.slotTargetStartIconcolor_softRed]: hasVariant(
                $state,
                "color",
                "softRed"
              ),
              [sty.slotTargetStartIconcolor_softSand]: hasVariant(
                $state,
                "color",
                "softSand"
              ),
              [sty.slotTargetStartIconcolor_softYellow]: hasVariant(
                $state,
                "color",
                "softYellow"
              ),
              [sty.slotTargetStartIconcolor_white]: hasVariant(
                $state,
                "color",
                "white"
              ),
              [sty.slotTargetStartIconcolor_yellow]: hasVariant(
                $state,
                "color",
                "yellow"
              ),
              [sty.slotTargetStartIconshowStartIcon]: hasVariant(
                $state,
                "showStartIcon",
                "showStartIcon"
              )
            })
          })}
        </div>
      ) : null}
      <div
        data-structo-name={"contentContainer"}
        data-structo-override={overrides.contentContainer}
        className={classNames(projectcss.all, sty.contentContainer, {
          [sty.contentContainer___focusVisibleWithin]:
            triggers.focusVisibleWithin_root,
          [sty.contentContainerisDisabled]: hasVariant(
            $state,
            "isDisabled",
            "isDisabled"
          ),
          [sty.contentContainershape_rounded]: hasVariant(
            $state,
            "shape",
            "rounded"
          ),
          [sty.contentContainershowEndIcon]: hasVariant(
            $state,
            "showEndIcon",
            "showEndIcon"
          )
        })}
      >
        {renderStructoSlot({
          defaultContents: "Button",
          value: args.children,
          className: classNames(sty.slotTargetChildren, {
            [sty.slotTargetChildren___focusVisibleWithin]:
              triggers.focusVisibleWithin_root,
            [sty.slotTargetChildrencolor_blue]: hasVariant(
              $state,
              "color",
              "blue"
            ),
            [sty.slotTargetChildrencolor_clear]: hasVariant(
              $state,
              "color",
              "clear"
            ),
            [sty.slotTargetChildrencolor_green]: hasVariant(
              $state,
              "color",
              "green"
            ),
            [sty.slotTargetChildrencolor_link]: hasVariant(
              $state,
              "color",
              "link"
            ),
            [sty.slotTargetChildrencolor_link_size_minimal]:
              hasVariant($state, "color", "link") &&
              hasVariant($state, "size", "minimal"),
            [sty.slotTargetChildrencolor_red]: hasVariant(
              $state,
              "color",
              "red"
            ),
            [sty.slotTargetChildrencolor_sand]: hasVariant(
              $state,
              "color",
              "sand"
            ),
            [sty.slotTargetChildrencolor_softBlue]: hasVariant(
              $state,
              "color",
              "softBlue"
            ),
            [sty.slotTargetChildrencolor_softGreen]: hasVariant(
              $state,
              "color",
              "softGreen"
            ),
            [sty.slotTargetChildrencolor_softRed]: hasVariant(
              $state,
              "color",
              "softRed"
            ),
            [sty.slotTargetChildrencolor_softSand]: hasVariant(
              $state,
              "color",
              "softSand"
            ),
            [sty.slotTargetChildrencolor_softYellow]: hasVariant(
              $state,
              "color",
              "softYellow"
            ),
            [sty.slotTargetChildrencolor_white]: hasVariant(
              $state,
              "color",
              "white"
            ),
            [sty.slotTargetChildrencolor_yellow]: hasVariant(
              $state,
              "color",
              "yellow"
            ),
            [sty.slotTargetChildrenisDisabled]: hasVariant(
              $state,
              "isDisabled",
              "isDisabled"
            ),
            [sty.slotTargetChildrenshape_rounded]: hasVariant(
              $state,
              "shape",
              "rounded"
            ),
            [sty.slotTargetChildrenshowEndIcon]: hasVariant(
              $state,
              "showEndIcon",
              "showEndIcon"
            ),
            [sty.slotTargetChildrenshowStartIcon]: hasVariant(
              $state,
              "showStartIcon",
              "showStartIcon"
            ),
            [sty.slotTargetChildrensize_minimal]: hasVariant(
              $state,
              "size",
              "minimal"
            )
          })
        })}
      </div>
      {(hasVariant($state, "showEndIcon", "showEndIcon") ? true : false) ? (
        <div
          data-structo-name={"endIconContainer"}
          data-structo-override={overrides.endIconContainer}
          className={classNames(projectcss.all, sty.endIconContainer, {
            [sty.endIconContainercolor_white]: hasVariant(
              $state,
              "color",
              "white"
            ),
            [sty.endIconContainercolor_yellow]: hasVariant(
              $state,
              "color",
              "yellow"
            ),
            [sty.endIconContainershowEndIcon]: hasVariant(
              $state,
              "showEndIcon",
              "showEndIcon"
            )
          })}
        >
          {renderStructoSlot({
            defaultContents: (
              <IconIcon
                className={classNames(projectcss.all, sty.svg__liJa)}
                role={"img"}
              />
            ),

            value: args.endIcon,
            className: classNames(sty.slotTargetEndIcon, {
              [sty.slotTargetEndIconcolor_clear]: hasVariant(
                $state,
                "color",
                "clear"
              ),
              [sty.slotTargetEndIconcolor_link]: hasVariant(
                $state,
                "color",
                "link"
              ),
              [sty.slotTargetEndIconcolor_softBlue]: hasVariant(
                $state,
                "color",
                "softBlue"
              ),
              [sty.slotTargetEndIconcolor_softGreen]: hasVariant(
                $state,
                "color",
                "softGreen"
              ),
              [sty.slotTargetEndIconcolor_softRed]: hasVariant(
                $state,
                "color",
                "softRed"
              ),
              [sty.slotTargetEndIconcolor_softSand]: hasVariant(
                $state,
                "color",
                "softSand"
              ),
              [sty.slotTargetEndIconcolor_softYellow]: hasVariant(
                $state,
                "color",
                "softYellow"
              ),
              [sty.slotTargetEndIconcolor_white]: hasVariant(
                $state,
                "color",
                "white"
              ),
              [sty.slotTargetEndIconcolor_yellow]: hasVariant(
                $state,
                "color",
                "yellow"
              ),
              [sty.slotTargetEndIconshowEndIcon]: hasVariant(
                $state,
                "showEndIcon",
                "showEndIcon"
              )
            })
          })}
        </div>
      ) : null}
    </button>
  ) as React.ReactElement | null;
}

function useBehavior<P extends pp.PlumeButtonProps>(
  props: P,
  ref: pp.ButtonRef
) {
  const b = pp.useButton<P, typeof StructoButton>(
    StructoButton,
    props,
    {
      showStartIconVariant: {
        group: "showStartIcon",
        variant: "showStartIcon"
      },
      showEndIconVariant: { group: "showEndIcon", variant: "showEndIcon" },
      isDisabledVariant: { group: "isDisabled", variant: "isDisabled" },
      contentSlot: "children",
      startIconSlot: "startIcon",
      endIconSlot: "endIcon",
      root: "root"
    },
    ref
  );
  if (b.structoProps.overrides.root.as === "a") {
    b.structoProps.overrides.root.as = StructoLink__;
    b.structoProps.overrides.root.props.component = Link;
    b.structoProps.overrides.root.props.platform = "nextjs";
  }
  return b;
}

const StructoDescendants = {
  root: ["root", "startIconContainer", "contentContainer", "endIconContainer"],
  startIconContainer: ["startIconContainer"],
  contentContainer: ["contentContainer"],
  endIconContainer: ["endIconContainer"]
} as const;
type NodeNameType = keyof typeof StructoDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof StructoDescendants)[T][number];
type NodeDefaultElementType = {
  root: "button";
  startIconContainer: "div";
  contentContainer: "div";
  endIconContainer: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  StructoButton__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: StructoButton__VariantsArgs;
    args?: StructoButton__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<StructoButton__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    // Specify args directly as props
    Omit<StructoButton__ArgsType, ReservedPropsType> &
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
          internalArgPropNames: StructoButton__ArgProps,
          internalVariantPropNames: StructoButton__VariantProps
        }),
      [props, nodeName]
    );
    return StructoButton__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "StructoButton";
  } else {
    func.displayName = `StructoButton.${nodeName}`;
  }
  return func;
}

export const StructoButton = Object.assign(
  // Top-level structoButton renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    startIconContainer: makeNodeComponent("startIconContainer"),
    contentContainer: makeNodeComponent("contentContainer"),
    endIconContainer: makeNodeComponent("endIconContainer"),

    // Metadata about props expected for structoButton
    internalVariantProps: StructoButton__VariantProps,
    internalArgProps: StructoButton__ArgProps,

    useBehavior
  }
);

export default StructoButton;
/* prettier-ignore-end */
