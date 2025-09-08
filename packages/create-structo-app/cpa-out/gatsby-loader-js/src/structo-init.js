import {
  initStructoLoader,
} from "@structoapp/loader-gatsby";

export function initStructoLoaderWithRegistrations(structoOptions) {
  const STRUCTO = initStructoLoader(structoOptions);



  return STRUCTO;
}
