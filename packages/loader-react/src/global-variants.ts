

import { InternalStructoComponentLoader } from "./loader-client";
import { useStructoRootContext } from "./StructoRootProvider";

export function createUseGlobalVariant(name: string, projectId: string) {
  return () => {
    const rootContext = useStructoRootContext();
    if (!rootContext) {
      return undefined;
    }

    const loader = rootContext.loader as InternalStructoComponentLoader;
    const spec = [
      ...loader.getGlobalVariants(),
      ...(rootContext.globalVariants ?? []),
    ].find(
      (spec2) =>
        spec2.name === name &&
        (!spec2.projectId || spec2.projectId === projectId)
    );
    return spec ? spec.value : undefined;
  };
}
