import {
  initStructoLoader,
  InitOptions,
} from "@structoapp/loader-gatsby";

export function initStructoLoaderWithRegistrations(structoOptions: InitOptions) {
  const STRUCTO = initStructoLoader(structoOptions);

  return STRUCTO;
}
