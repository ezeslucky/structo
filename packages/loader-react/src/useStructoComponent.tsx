import * as React from 'react';
import { useStructoRootContext } from './StructoRootProvider';
import {
  ComponentLookupSpec,
  useForceUpdate,
  useIsMounted,
  useStableLookupSpec,
} from './utils';


export function useStructoComponent<P extends React.ComponentType = any>(
  spec: ComponentLookupSpec,
  opts: { forceOriginal?: boolean } = {}
) {
  const rootContext = useStructoRootContext();
  if (!rootContext) {
    throw new Error(
      `You can only use useStructoComponent if wrapped in <StructoRootProvider />`
    );
  }

  const loader = rootContext.loader;
  const lookup = loader.getLookup();

  const component = lookup.hasComponent(spec)
    ? lookup.getComponent(spec, opts)
    : undefined;

  const stableSpec = useStableLookupSpec(spec);
  const isMounted = useIsMounted();
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    if (!component) {
      (async () => {
        await loader.fetchComponentData(stableSpec);
        if (isMounted()) {
          forceUpdate();
        }
      })();
    }
  }, [component, stableSpec]);

  return component as P;
}
