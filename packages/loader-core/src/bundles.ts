import { LoaderBundleOutput } from "@structoapp/loader-fetcher";
import { DepsGraph } from "./deps-graph";


export function getBundleSubset(
  bundle: LoaderBundleOutput,
  names: string[],
  opts?: {
    target?: "browser" | "server";
  }
): LoaderBundleOutput {
  const namesSet = new Set(names);
  const target = opts?.target ?? "browser";

  const forBrowser = target === "browser";
  const graph = new DepsGraph(bundle, forBrowser);
  const deps = new Set(names.flatMap((name) => graph.getTransitiveDeps(name)));
  const isSubModule = (fileName: string) =>
    deps.has(fileName) || namesSet.has(fileName);
  const modules = bundle.modules[target];
  //@ts-ignore
  const filteredModules = modules.filter((mod) => isSubModule(mod.fileName));
  //@ts-ignore
  const filteredComponents = bundle.components.filter((c) =>
    isSubModule(c.entry)
  );
  //@ts-ignore

  const filteredComponentsIds = new Set(filteredComponents.map((c) => c.id));

  // Make deep copy of filteredIds to avoid mutating original bundle
  const filteredIds = Object.fromEntries(
    //@ts-ignore
    Object.entries(bundle.filteredIds).map(([k, v]) => [k, [...v]])
  );
  bundle.components
  //@ts-ignore
    .filter((c) => !filteredComponentsIds.has(c.id))
    //@ts-ignore
    .forEach((component) => {
      filteredIds[component.projectId] = filteredIds[component.projectId] ?? [];
      if (!filteredIds[component.projectId].includes(component.id)) {
        filteredIds[component.projectId].push(component.id);
      }
    });

  return {
    modules: {
      browser: forBrowser ? filteredModules : [],
      server: forBrowser ? [] : filteredModules,
    },
    components: filteredComponents,
    globalGroups: bundle.globalGroups,
    projects: bundle.projects,
    activeSplits: bundle.activeSplits,
    bundleKey: bundle.bundleKey ?? null,
    deferChunksByDefault: bundle.deferChunksByDefault,
    disableRootLoadingBoundaryByDefault:
      bundle.disableRootLoadingBoundaryByDefault,
    filteredIds,
  };
}
