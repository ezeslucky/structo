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
  deriveRenderOpts,
  ensureGlobalVariants,
  hasVariant
} from "@structoapp/react-web";
import { useDataEnv } from "@structoapp/react-web/lib/host";
import RandomDynamicPageButton from "../../RandomDynamicPageButton"; // structo-import: Q23H1_1M_P/component
import { useScreenVariants as useScreenVariantsscBjPxgdxdzbv } from "./StructoGlobalVariant__Screen"; // structo-import: SCBjPXGDXDZBV/globalVariant
import "@structoapp/react-web/lib/structo.css";
import projectcss from "./structo.module.css"; // structo-import: 47tFXWjN2C4NyHFGGpaYQ3/projectcss
import sty from "./StructoHomepage.module.css"; // structo-import: 6uuAAE1jiCew/css

createStructoElementProxy;

export const StructoHomepage__VariantProps = new Array();

export const StructoHomepage__ArgProps = new Array();

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function StructoHomepage__RenderFunc(props) {
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
  const globalVariants = ensureGlobalVariants({
    screen: useScreenVariantsscBjPxgdxdzbv()
  });
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
              {"create-structo-app"}
            </h1>
            <div
              data-structo-name={"text"}
              data-structo-override={overrides.text}
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text
              )}
            >
              {hasVariant(globalVariants, "screen", "desktopOnly") ? (
                <React.Fragment>
                  <React.Fragment>
                    {
                      "This project is used by run-cpa.ts in the create-structo-app repo.\n\nrun-cpa.ts runs create-structo-app for many combinations of args (e.g. nextjs + appDir + loader + typescript) to check for changes in generated files. Any changes to this project will result in lots of changes to the generated files. "
                    }
                  </React.Fragment>
                  <span
                    className={"structo_default__all structo_default__span"}
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
                    className={"structo_default__all structo_default__span"}
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
  root: ["root", "section", "h1", "text", "randomDynamicPageButton"],
  section: ["section", "h1", "text", "randomDynamicPageButton"],
  h1: ["h1"],
  text: ["text"],
  randomDynamicPageButton: ["randomDynamicPageButton"]
};

function makeNodeComponent(nodeName) {
  const func = function (props) {
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
  // Top-level structoHomepage renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    section: makeNodeComponent("section"),
    h1: makeNodeComponent("h1"),
    text: makeNodeComponent("text"),
    randomDynamicPageButton: makeNodeComponent("randomDynamicPageButton"),
    // Metadata about props expected for structoHomepage
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

export default StructoHomepage;
/* prettier-ignore-end */
