/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  classNames,
  createStructoElementProxy,
  deriveRenderOpts
} from "@structoapp/react-web";
import { useDataEnv } from "@structoapp/react-web/lib/host";
import RandomDynamicPageButton from "../../RandomDynamicPageButton"; // structo-import: Q23H1_1M_P/component
import "@structoapp/react-web/lib/structo.css";
import projectcss from "./structo.module.css"; // structo-import: 47tFXWjN2C4NyHFGGpaYQ3/projectcss
import sty from "./StructoDynamicPage.module.css"; // structo-import: AO44A-w7hh/css

createStructoElementProxy;

export const StructoDynamicPage__VariantProps = new Array();

export const StructoDynamicPage__ArgProps = new Array();

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function StructoDynamicPage__RenderFunc(props) {
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
  return (
    <React.Fragment>
      <Head></Head>

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
  );
}

const StructoDescendants = {
  root: ["root", "section", "h1", "randomDynamicPageButton"],
  section: ["section", "h1", "randomDynamicPageButton"],
  h1: ["h1"],
  randomDynamicPageButton: ["randomDynamicPageButton"]
};

function makeNodeComponent(nodeName) {
  const func = function (props) {
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
