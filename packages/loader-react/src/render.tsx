import { extractStructoQueryData } from "@structoapp/prepass";
import React from "react";
import ReactDOM from "react-dom";
import { renderToString as reactRenderToString } from "react-dom/server";
import { ComponentRenderData, StructoComponentLoader } from "./loader-shared";
import { StructoComponent } from "./StructoComponent";
import { GlobalVariantSpec, StructoRootProvider } from "./StructoRootProvider";
import { ComponentLookupSpec } from "./utils";

export async function renderToElement(
  loader: StructoComponentLoader,
  target: HTMLElement,
  lookup: ComponentLookupSpec,
  opts: {
    prefetchedData?: ComponentRenderData;
    componentProps?: any;
    globalVariants?: GlobalVariantSpec[];
    prefetchedQueryData?: Record<string, any>;
    pageParams?: Record<string, any>;
    pageQuery?: Record<string, any>;
  } = {}
) {
  return new Promise<void>((resolve) => {
    const element = makeElement(loader, lookup, opts);
    ReactDOM.render(element, target, () => resolve());
  });
}

export function renderToString(
  loader: StructoComponentLoader,
  lookup: ComponentLookupSpec,
  opts: {
    prefetchedData?: ComponentRenderData;
    componentProps?: any;
    globalVariants?: GlobalVariantSpec[];
    prefetchedQueryData?: Record<string, any>;
  } = {}
) {
  const element = makeElement(loader, lookup, opts);
  return reactRenderToString(element);
}

export async function extractStructoQueryDataFromElement(
  loader: StructoComponentLoader,
  lookup: ComponentLookupSpec,
  opts: {
    prefetchedData?: ComponentRenderData;
    componentProps?: any;
    globalVariants?: GlobalVariantSpec[];
    prefetchedQueryData?: Record<string, any>;
  } = {}
) {
  const element = makeElement(loader, lookup, opts);
  return extractStructoQueryData(element);
}

export async function hydrateFromElement(
  loader: StructoComponentLoader,
  target: HTMLElement,
  lookup: ComponentLookupSpec,
  opts: {
    prefetchedData?: ComponentRenderData;
    componentProps?: any;
    globalVariants?: GlobalVariantSpec[];
    prefetchedQueryData?: Record<string, any>;
  } = {}
) {
  return new Promise<void>((resolve) => {
    const element = makeElement(loader, lookup, opts);
    ReactDOM.hydrate(element, target, () => resolve());
  });
}

function makeElement(
  loader: StructoComponentLoader,
  lookup: ComponentLookupSpec,
  opts: {
    prefetchedData?: ComponentRenderData;
    componentProps?: any;
    globalVariants?: GlobalVariantSpec[];
    prefetchedQueryData?: Record<string, any>;
    pageParams?: Record<string, any>;
    pageQuery?: Record<string, any>;
  } = {}
) {
  return (
    <StructoRootProvider
      loader={loader}
      prefetchedData={opts.prefetchedData}
      globalVariants={opts.globalVariants}
      prefetchedQueryData={opts.prefetchedQueryData}
      pageParams={opts.pageParams}
      pageQuery={opts.pageQuery}
    >
      <StructoComponent
        component={typeof lookup === "string" ? lookup : lookup.name}
        projectId={typeof lookup === "string" ? undefined : lookup.projectId}
        componentProps={opts.componentProps}
      />
    </StructoRootProvider>
  );
}
