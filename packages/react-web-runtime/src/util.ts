import { createStructoElementProxy } from "@structoapp/react-web";


export function jsxShim(
  type: React.ElementType<any>,
  props: any,
  key?: string
) {
  const { children, ...restProps } = props;
  restProps["key"] = key;
  return createStructoElementProxy(
    type,
    restProps,
    //@ts-ignore
    ...(Array.isArray(children) ? children : children ? [children] : [])
  );
}
