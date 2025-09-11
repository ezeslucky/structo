import type { CodeModule } from "@structoapp/loader-core";
import {
  StructoRootProvider as CommonStructoRootProvider,
  ComponentLookupSpec,
  FetchComponentDataOpts as InternalFetchComponentDataOpts,
  InternalStructoComponentLoader,
  StructoComponentLoader,
  extractStructoQueryData as internalExtractStructoQueryData,
} from "@structoapp/loader-react";
import { IncomingMessage, ServerResponse } from "http";
export {
  DataCtxReader,
  DataProvider,
  GlobalActionsContext,
  GlobalActionsProvider,
  PageParamsProvider,
  StructoCanvasContext,
  StructoCanvasHost,
  StructoComponent,
  StructoTranslatorContext,
  StructoPrepass,
  repeatedElement,
  useDataEnv,
  useStructoCanvasComponentInfo,
  useStructoCanvasContext,
  useStructoComponent,
  useStructoQueryData,
  useSelector,
  useSelectors,
} from "@structoapp/loader-react";
export type {
  CodeComponentMeta,
  CustomFunctionMeta,
  GlobalContextMeta,
  StructoTranslator,
  PropType,
  TokenRegistration,
} from "@structoapp/loader-react";
export { ExtractStructoQueryData as __EXPERMIENTAL__ExtractStructoQueryData } from "@structoapp/nextjs-app-router";
export * from "./shared-exports";

import NextHead from "next/head.js";
import NextLink from "next/link.js";
import * as NextRouter from "next/router.js";
import Script from "next/script";
import * as React from "react";
import { initStructoLoaderWithCache } from "./cache";
import { wrapRouterContext } from "./mocks";
import type { ComponentRenderData, NextInitOptions } from "./shared-exports";

type ServerRequest = IncomingMessage & {
  cookies: Partial<{
    [key: string]: string;
  }>;
};

const reactMajorVersion = +React.version.split(".")[0];

function filterCodeFromRenderData(data: ComponentRenderData) {
  if (reactMajorVersion >= 18 && !!data.bundle.bundleKey) {
    // Keep the entrypoints
    const entrypoints = new Set([
      ...data.entryCompMetas.map((compMeta) => compMeta.entry),
      "root-provider.js",
      ...data.bundle.projects
        .map((x) => x.globalContextsProviderFileName)
        .filter((x) => !!x),
      ...data.bundle.components
        .filter((c) => c.isGlobalContextProvider)
        .map((c) => c.entry),
      ...data.bundle.globalGroups.map((g) => g.contextFile),
    ]);

    data.bundle.modules.browser = data.bundle.modules.browser.map((module) => {
      if (module.type !== "code" || entrypoints.has(module.fileName)) {
        return module;
      }
      return { ...module, code: "" };
    });
  }
}

export interface FetchComponentDataOpts extends InternalFetchComponentDataOpts {
  /**
   * Defer loading code chunks to script tags, reducing initial payload size.
   */
  deferChunks?: boolean;
}

export class NextJsStructoComponentLoader extends StructoComponentLoader {
  constructor(internal: InternalStructoComponentLoader) {
    super(internal);
  }

  async getActiveVariation(opts: {
    req?: ServerRequest;
    res?: ServerResponse;
    known?: Record<string, string>;
    traits: Record<string, string | number | boolean>;
  }) {
    const extractBuiltinTraits = () => {
      const url = new URL(
        opts.req?.url ?? "/",
        `https://${opts.req?.headers.host ?? "server.side"}`
      );
      return {
        pageUrl: url.href,
      };
    };

    return this._getActiveVariation({
      enableUnseededExperiments: true,
      traits: {
        ...extractBuiltinTraits(),
        ...opts.traits,
      },
      getKnownValue: (key: string) => {
        if (opts.known) {
          return opts.known[key];
        } else {
          return opts.req?.cookies[`structo:${key}`] ?? undefined;
        }
      },
      updateKnownValue: (key: string, value: string) => {
        if (opts.res) {
          const cookie = `structo:${key}=${value}`;
          const resCookie = opts.res?.getHeader("Set-Cookie") ?? [];
          let newCookies: string[] = [];
          if (Array.isArray(resCookie)) {
            newCookies = [...resCookie, `structo:${key}=${value}`];
          } else {
            newCookies = [`${resCookie}`, cookie];
          }

          opts.res?.setHeader("Set-Cookie", newCookies);
        }
      },
    });
  }

  maybeFetchComponentData(
    specs: ComponentLookupSpec[],
    opts?: FetchComponentDataOpts
  ): Promise<ComponentRenderData | null>;
  maybeFetchComponentData(
    ...specs: ComponentLookupSpec[]
  ): Promise<ComponentRenderData | null>;
  async maybeFetchComponentData(
    ...args: any[]
  ): Promise<ComponentRenderData | null> {
    const data = await super.maybeFetchComponentData(...args);
    const { opts } = parseFetchComponentDataArgs(...args);
    if (
      data &&
      (opts?.deferChunks ||
        (opts?.deferChunks === undefined && data.bundle.deferChunksByDefault))
    ) {
      filterCodeFromRenderData(data);
    }
    return data;
  }

  fetchComponentData(
    ...specs: ComponentLookupSpec[]
  ): Promise<ComponentRenderData>;
  fetchComponentData(
    specs: ComponentLookupSpec[],
    opts?: FetchComponentDataOpts
  ): Promise<ComponentRenderData>;
  async fetchComponentData(...args: any[]): Promise<ComponentRenderData> {
    const data = await super.fetchComponentData(...args);
    const { opts } = parseFetchComponentDataArgs(...args);
    if (
      opts?.deferChunks ||
      (opts?.deferChunks === undefined && data.bundle.deferChunksByDefault)
    ) {
      filterCodeFromRenderData(data);
    }
    return data;
  }
}

function parseFetchComponentDataArgs(
  specs: ComponentLookupSpec[],
  opts?: FetchComponentDataOpts
): { specs: ComponentLookupSpec[]; opts?: FetchComponentDataOpts };
function parseFetchComponentDataArgs(...specs: ComponentLookupSpec[]): {
  specs: ComponentLookupSpec[];
  opts?: FetchComponentDataOpts;
};
function parseFetchComponentDataArgs(...args: any[]) {
  let specs: ComponentLookupSpec[];
  let opts: FetchComponentDataOpts | undefined;
  if (Array.isArray(args[0])) {
    specs = args[0];
    opts = args[1];
  } else {
    specs = args;
    opts = undefined;
  }
  return { specs, opts };
}

export function initStructoLoader(opts: NextInitOptions) {
  const loader = initStructoLoaderWithCache<NextJsStructoComponentLoader>(
    (opts) =>
      new NextJsStructoComponentLoader(
        new InternalStructoComponentLoader(opts)
      ),
    opts
  );
  loader.registerModules({
    "next/head": NextHead,
    "next/link": NextLink,
    "next/router": NextRouter,
  });
  if (opts.nextNavigation) {
    loader.registerModules({
      "next/navigation": opts.nextNavigation,
    });
  }
  return loader;
}


export async function extractStructoQueryData(element: React.ReactElement) {
  return internalExtractStructoQueryData(await wrapRouterContext(element));
}

const StructoNextLink = React.forwardRef(function StructoNextLink(
  props: React.ComponentProps<typeof NextLink>,
  ref: React.Ref<HTMLAnchorElement>
) {
  // Basically renders NextLink, except when href is undefined,
  // which freaks out NextLink :-/
  if (props.href) {
    const {
      href,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
      locale,
      ...rest
    } = props;
    // If this is a fragment identifier link, then we set
    // scroll={false} so that smooth scrolling works
    const isFragment = typeof href === "string" && href.startsWith("#");
    // We use legacyBehavior, because we don't know which
    // version of next the user has installed
    return (
      <NextLink
        href={href}
        replace={replace}
        scroll={scroll != null ? scroll : isFragment ? false : undefined}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        locale={locale}
        {...({ legacyBehavior: true } as any)}
      >
        <a {...rest} ref={ref} />
      </NextLink>
    );
  } else {
    return <a {...props} href={undefined} ref={ref} />;
  }
});

export function StructoRootProvider(
  // We omit Head but still allow override for Link
  props: Omit<
    React.ComponentProps<typeof CommonStructoRootProvider>,
    "Head"
  > & { skipChunks?: boolean }
) {
  return (
    <>
      {!props.skipChunks &&
        renderDynamicPayloadScripts(props.loader, props.prefetchedData)}
      <CommonStructoRootProvider
        Head={NextHead}
        Link={StructoNextLink}
        {...props}
      />
    </>
  );
}

function renderDynamicPayloadScripts(
  loader: StructoComponentLoader,
  prefetchedData: ComponentRenderData | undefined
) {
  const missingModulesData =
    prefetchedData &&
    prefetchedData.bundle.modules.browser.filter(
      (module): module is CodeModule => module.type === "code" && !module.code
    );
  if (!missingModulesData || missingModulesData.length === 0) {
    return null;
  }

  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    if (!(globalThis as any).__StructoBundlePromises) {
      (globalThis as any).__StructoBundlePromises = {};
    }
    for (const { fileName } of missingModulesData) {
      if (!(globalThis as any).__StructoBundlePromises[fileName]) {
        (globalThis as any).__StructoBundlePromises[fileName] = new Promise(
          (resolve) => {
            (globalThis as any).__StructoBundlePromises[
              "__promise_resolve_" + fileName
            ] = resolve;
          }
        );
      }
    }
  }

  return (
    <>
      <Script
        strategy="beforeInteractive"
        key={"init:" + missingModulesData.map((m) => m.fileName).join(";")}
        id={"init:" + missingModulesData.map((m) => m.fileName).join(";")}
        dangerouslySetInnerHTML={{
          __html: `
            if (!globalThis.__StructoBundlePromises) {
              globalThis.__StructoBundlePromises = {};
            }
            ${missingModulesData
              .map(
                (
                  module
                ) => `if (!globalThis.__StructoBundlePromises[${JSON.stringify(
                  module.fileName
                )}]) {
                  globalThis.__StructoBundlePromises[${JSON.stringify(
                    module.fileName
                  )}] = new Promise((resolve) => {
                    globalThis.__StructoBundlePromises[${JSON.stringify(
                      "__promise_resolve_" + module.fileName
                    )}] = resolve;
                  })
                }
              `
              )
              .join("\n")}`.trim(),
        }}
      ></Script>
      <Script
        strategy="beforeInteractive"
        key={"load:" + missingModulesData.map((m) => m.fileName).join(";")}
        id={"load:" + missingModulesData.map((m) => m.fileName).join(";")}
        defer
        async
        src={loader.getChunksUrl(prefetchedData.bundle, missingModulesData)}
      />
    </>
  );
}
