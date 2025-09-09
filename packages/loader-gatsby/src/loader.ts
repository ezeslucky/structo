import {
  InitOptions,
  initStructoLoader as initStructoLoaderReact,
} from "@structoapp/loader-react";
import * as Gatsby from "gatsby";

export function initStructoLoader(opts: InitOptions) {
  const loader = initStructoLoaderReact({
    onClientSideFetch: "warn",
    ...opts,
    platform: "gatsby",
  });

  loader.registerModules({
    gatsby: Gatsby,
  });

  return loader;
}
