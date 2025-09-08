/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

import * as React from "react";
import { navigate as __gatsbyNavigate } from "gatsby";
import {
  classNames,
  createStructoElementProxy,
  deriveRenderOpts
} from "@structoapp/react-web";
import { useDataEnv } from "@structoapp/react-web/lib/host";
import Button from "../../Button"; // structo-import: TQcvW_pSKi3/component
import "@structoapp/react-web/lib/structo.css";
import * as sty from "./StructoRandomDynamicPageButton.module.css"; // structo-import: Q23H1_1M_P/css

createStructoElementProxy;

export const StructoRandomDynamicPageButton__VariantProps = new Array();

export const StructoRandomDynamicPageButton__ArgProps = new Array();

const $$ = {};

function StructoRandomDynamicPageButton__RenderFunc(props) {
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
    <Button
      data-structo-name={"root"}
      data-structo-override={overrides.root}
      data-structo-root={true}
      data-structo-for-node={forNode}
      className={classNames("__wab_instance", sty.root)}
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
                  __gatsbyNavigate(destination);
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
  );
}

const StructoDescendants = {
  root: ["root"]
};

function makeNodeComponent(nodeName) {
  const func = function (props) {
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

export default StructoRandomDynamicPageButton;
/* prettier-ignore-end */
