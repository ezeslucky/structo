import * as React from "react";
import { useStructoRootContext } from "./StructoRootProvider";
import { useStructoComponent } from "./useStructoComponent";
import { MaybeWrap } from "./utils";

const StructoComponentContext = React.createContext(false);

export function StructoComponent(props: {
  /**
   * Name of the component to render, or the path of the page component
   */
  component: string;
  /**
   * Optionally specify a projectId if there are multiple components
   * of the same name from different projects
   */
  projectId?: string;
  /**
   * If you used registerComponent(), then if the name matches a registered
   * component, that component is used.  If you want the Plasmic-generated
   * component instead, specify forceOriginal.
   */
  forceOriginal?: boolean;
  componentProps?: any;
}): React.ReactElement | null {
  const { component, projectId, componentProps, forceOriginal } = props;

  const rootContext = useStructoRootContext();
  const isRootLoader = !React.useContext(StructoComponentContext);

  if (!rootContext) {
    // no existing PlasmicRootProvider
    throw new Error(
      `You must use <StructoRootProvider/> at the root of your app`
    );
  }

  const {
    loader,
    globalContextsProps,
    variation,
    userAuthToken,
    isUserLoading,
    authRedirectUri,
    translator,
    ...rest
  } = rootContext;

  const Component = useStructoComponent(
    { name: component, projectId, isCode: false },
    { forceOriginal }
  );

  React.useEffect(() => {
    if (isRootLoader) {
      const meta = loader
        .getLookup()
        .getComponentMeta({ name: component, projectId });

      if (meta) {
        loader.trackRender({
          renderCtx: {
            rootProjectId: meta.projectId,
            rootComponentId: meta.id,
            rootComponentName: component,
            teamIds: loader.getTeamIds(),
            projectIds: loader.getProjectIds(),
          },
          variation,
        });
      }
    }
  }, [component, projectId, loader, variation]);

  const element = React.useMemo(() => {
    if (!Component) {
      return null;
    }

    let elt = <Component {...componentProps} />;

    if (isRootLoader) {
      const lookup = loader.getLookup();
      const ReactWebRootProvider = lookup.getRootProvider();
      const GlobalContextsProvider = lookup.getGlobalContextsProvider({
        name: component,
        projectId,
      });
      elt = (
        <ReactWebRootProvider
          {...rest}
          userAuthToken={userAuthToken}
          isUserLoading={isUserLoading}
          authRedirectUri={authRedirectUri}
          i18n={{
            translator,
            tagPrefix: loader.opts.i18n?.tagPrefix,
          }}
        >
          <MaybeWrap
            cond={!!GlobalContextsProvider}
            wrapper={(children) => (
              <GlobalContextsProvider {...globalContextsProps}>
                {children}
              </GlobalContextsProvider>
            )}
          >
            <StructoComponentContext.Provider value={true}>
              {elt}
            </StructoComponentContext.Provider>
          </MaybeWrap>
        </ReactWebRootProvider>
      );
    }
    return elt;
  }, [
    Component,
    componentProps,
    loader,
    isRootLoader,
    component,
    projectId,
    globalContextsProps,
    userAuthToken, // Just use the token to memo, `user` should be derived from it
    isUserLoading,
    authRedirectUri,
  ]);
  return element;
}
