import { ComponentMeta, LoaderBundleOutput } from "@structoapp/loader-core";
import {
  convertBundlesToComponentRenderData,
  InitOptions,
  initStructoLoader,
  matchesPagePath,
} from "@structoapp/loader-react";
import type { StructoRemoteChangeWatcher as Watcher } from "@structoapp/watcher";
import { CreatePagesArgs, GatsbyNode, PluginOptions } from "gatsby";
import serverRequire from "./server-require";

export const onPreInit: GatsbyNode["onPreInit"] = ({ reporter }) =>
  reporter.success("Loaded @structoapp/loader-gatsby");

export type GatsbyPluginOptions = PluginOptions &
  InitOptions & {
    defaultStructoPage?: string;
    ignorePaths?: string[];
  };

const STRUCTO_NODE_NAME = "structoData";

const STRUCTO_DATA_TYPE = `
  type ${STRUCTO_NODE_NAME} implements Node {
    name: String!
    displayName: String!
    projectId: String!
    path: String
    isPage: Boolean!
    renderData: JSON!
  }

  type Query {
    structoComponents(componentNames: [String]!): JSON
    structoOptions: JSON
  }
`;

const SOURCE_WAIT_TIME = 3000; // 3 seconds
const SOURCE_MAX_WAIT_TIME = 10000; // 10 seconds

let allPaths: string[] = [];

export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  { actions, createContentDigest, reporter },
  opts: GatsbyPluginOptions
) => {
  const { createNode, deleteNode } = actions;

  let allComponents: any[] = [];

  const refreshData = async () => {
    reporter.info(`[Structo Loader] - Creating nodes`);

    const STRUCTO = initStructoLoader({
      projects: opts.projects,
      preview: opts.preview,
      host: opts.host,
      platform: "gatsby",
    });

    const components = await STRUCTO.fetchComponents();

    for (const component of allComponents) {
      const hasComponent = components.some((c) => c.name === component.name);
      
      if (!hasComponent) {
        deleteNode(component);
        reporter.verbose(`[Structo Loader] - Deleted node ${component.name}`);
      }
    }

    allComponents = [];
    for (const component of components) {
      const renderData = await STRUCTO.fetchComponentData({
        name: component.name,
        projectId: component.projectId,
      });

      const curComponent = {
        ...component,
        renderData,
      };

      const componentMeta = {
        parent: null,
        children: [],
        internal: {
          type: STRUCTO_NODE_NAME,
          contentDigest: createContentDigest(curComponent),
        },
      };

      const componentNode = Object.assign({}, curComponent, componentMeta);

      createNode(componentNode);
      reporter.verbose(
        `[Structo Loader] - Created component node ${component.name}`
      );
      allComponents.push(componentNode);
    }
  };

  if (process.env.NODE_ENV !== "production") {
    const debounce = serverRequire("lodash/debounce");
    const triggerSourcing = debounce(refreshData, SOURCE_WAIT_TIME, {
      maxWait: SOURCE_MAX_WAIT_TIME,
    });

    try {
      const StructoRemoteChangeWatcher = serverRequire("@structoapp/watcher")
        .StructoRemoteChangeWatcher as typeof Watcher;

      const watcher = new StructoRemoteChangeWatcher({
        projects: opts.projects,
        host: opts.host,
      });

      watcher.subscribe({
        onUpdate: () => {
          if (opts.preview) {
            triggerSourcing();
          }
        },
        onPublish: () => {
          if (!opts.preview) {
            triggerSourcing();
          }
        },
      });
    } catch (e) {
      console.warn("Couldn't subscribe to Structo changes", e);
    }
  }

  await refreshData();
};

async function getAllNodes(nodeModel: any, type: any) {
  try {
    const { entries } = await nodeModel.findAll({ type });
    return Array.from(entries);
  } catch (_) {
    // Gatsby < v4 does not have `nodeModel.findAll`, so we try to use the
    // deprecated `nodeModel.getAllNodes` instead.
    return nodeModel.getAllNodes({ type });
  }
}

export const createResolvers: GatsbyNode["createResolvers"] = (
  { createResolvers },
  opts
) => {
  createResolvers({
    Query: {
      structoComponents: {
        type: "JSON",
        args: {
          componentNames: `[String]!`,
        },
        async resolve(
          _source: unknown,
          args: { componentNames: string[] },
          context: any,
          _info: unknown
        ) {
          const { componentNames } = args;

          const components = await getAllNodes(
            context.nodeModel,
            STRUCTO_NODE_NAME
          );

          const bundles: LoaderBundleOutput[] = [];
          const compMetas: (ComponentMeta & {
            params?: Record<string, string>;
          })[] = [];
          for (const component of components) {
            if (
              componentNames.includes(component.name) ||
              componentNames.includes(component.displayName) ||
              !!(
                component.path &&
                componentNames.some((lookup) =>
                  matchesPagePath(component.path, lookup)
                )
              )
            ) {
              const bundle = component.renderData?.bundle;
              if (bundle) {
                bundles.push(bundle);

                let meta = component;

                // If component is a page, try to parse dynamic params.
                if (component.path) {
                  for (const lookup of componentNames) {
                    const match = matchesPagePath(component.path, lookup);
                    if (match) {
                      meta = { ...meta, params: match.params };
                      break;
                    }
                  }
                }

                compMetas.push(meta);
              }
            }
          }

          const renderData = convertBundlesToComponentRenderData(
            bundles,
            compMetas
          );

          renderData?.entryCompMetas.sort(
            (meta1, meta2) =>
              // We sort the matched component metas by the number of path params, so
              // if there are two pages `/products/foo` and `/products/[slug]`,
              // the first one will have higher precedence.
              Array.from(Object.keys(meta1.params || {})).length -
              Array.from(Object.keys(meta2.params || {})).length
          );

          return renderData;
        },
      },
      structoOptions: {
        type: "JSON",
        resolve() {
          return {
            projects: opts.projects,
            preview: opts.preview,
            host: opts.host,
          };
        },
      },
    },
  });
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    const { createTypes } = actions;
    createTypes(STRUCTO_DATA_TYPE);
  };

interface LoaderGatsbyPluginOptions extends GatsbyPluginOptions {
  defaultStructoPage: string;
}

export const createPages: GatsbyNode["createPages"] = async (
  { graphql, actions, reporter, store }: CreatePagesArgs,
  opts: LoaderGatsbyPluginOptions
) => {
  const { defaultStructoPage } = opts;

  const ignorePaths = opts.ignorePaths || [];

  if (defaultStructoPage) {
    reporter.info(`[Structo Loader] - Creating pages`);

    const { createPage, deletePage } = actions;
    const result = await graphql<{
      allStructoData: { nodes: Array<{ path: string }> };
    }>(`
      query {
        allStructoData(filter: { isPage: { eq: true } }) {
          nodes {
            path
          }
        }
      }
    `);

    const pages = result.data?.allStructoData.nodes;
    if (!pages) {
      reporter.error(`[Structo Loader] - GraphQL did not return pages`);
      return;
    }

    for (const originalPath of allPaths) {
      // `deletePage` might throw if the path is not in the expected format.
      // We first check if the pages include the original path, and, if not,
      // we assume it's due to an extra / missing trailing slash and try again.
      let path = originalPath;
      try {
        // Store is considered private API so use it only inside try-catch
        const storedPages = store.getState().pages;
        if (!storedPages.get(path)) {
          path = path.match(/\w\/$/) ? path.replace(/\/$/, "") : `${path}/`;
          if (!storedPages.get(path)) {
            path = originalPath;
          }
        }
      } catch {
        path = originalPath;
      }
      deletePage({
        path,
        component: defaultStructoPage,
      });
      reporter.verbose(`[Structo Loader] - Deleted page ${path}`);
    }

    allPaths = [];

    for (const page of pages) {
      const path = page.path;
      if (ignorePaths.includes(path) || ignorePaths.includes(path + "/")) {
        continue;
      }
      allPaths.push(page.path);

      createPage({
        path: page.path,
        component: defaultStructoPage,
        context: {},
      });
      reporter.verbose(`[Structo Loader] - Created page ${page.path}`);
    }
  }
};
