import React from "react";

const StructoLinkContext = React.createContext<
  React.ComponentType<any> | undefined
>(undefined);

export function useStructoLinkMaybe():
  | React.ComponentType<React.ComponentProps<"a">>
  | undefined {
  return React.useContext(StructoLinkContext);
}

const AnchorLink = React.forwardRef(function AnchorLink(
  props: React.ComponentProps<"a">,
  ref: React.Ref<HTMLAnchorElement>
) {
  return <a {...props} ref={ref} />;
});

export function useStructoLink(): React.ComponentType<
  React.ComponentProps<"a">
> {
  const Link = React.useContext(StructoLinkContext);
  if (Link) {
    return Link;
  } else {
    return AnchorLink as React.ComponentType<React.ComponentProps<"a">>;
  }
}

export function StructoLinkProvider(props: {
  Link: React.ComponentType<any> | undefined;
  children?: React.ReactNode;
}) {
  const { Link, children } = props;
  return (
    <StructoLinkContext.Provider value={Link}>
      {children}
    </StructoLinkContext.Provider>
  );
}
