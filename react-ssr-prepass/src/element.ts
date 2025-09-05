import { Children, ReactNode, ComponentType } from "react";
import { AbstractContext, AbstractElement } from "./types";

import {
  type ReactSymbol,
  REACT_ELEMENT_TYPE,
  REACT_TRANSITIONAL_ELEMENT_TYPE,
  REACT_PORTAL_TYPE,
  REACT_FRAGMENT_TYPE,
  REACT_STRICT_MODE_TYPE,
  REACT_PROFILER_TYPE,
  REACT_PROVIDER_TYPE,
  REACT_CONTEXT_TYPE,
  REACT_CONCURRENT_MODE_TYPE,
  REACT_FORWARD_REF_TYPE,
  REACT_SUSPENSE_TYPE,
  REACT_MEMO_TYPE,
  REACT_LAZY_TYPE,
  REACT_CONSUMER_TYPE,
} from "./symbols";
import { isReact19 } from "./utils";

/** Is a given Component a class component */
export const shouldConstruct = (Comp: ComponentType<any>): boolean =>
  !!(Comp as any).prototype?.isReactComponent;

/** Determine the type of element using react-is with applied fixes */
export const typeOf = (x: AbstractElement): ReactSymbol | undefined => {
  switch (x.$$typeof) {
    case REACT_PORTAL_TYPE:
      return REACT_PORTAL_TYPE;

    case REACT_ELEMENT_TYPE:
    case REACT_TRANSITIONAL_ELEMENT_TYPE:
      //@ts-ignore
      switch (x.type) {
        case REACT_CONCURRENT_MODE_TYPE:
          return REACT_CONCURRENT_MODE_TYPE;
        case REACT_FRAGMENT_TYPE:
          return REACT_FRAGMENT_TYPE;
        case REACT_PROFILER_TYPE:
          return REACT_PROFILER_TYPE;
        case REACT_STRICT_MODE_TYPE:
          return REACT_STRICT_MODE_TYPE;
        case REACT_SUSPENSE_TYPE:
          return REACT_SUSPENSE_TYPE;

        default: {
          //@ts-ignore
          const typeSymbol = (x.type as any)?.$$typeof as ReactSymbol;
          switch (typeSymbol) {
            case REACT_LAZY_TYPE:
              return REACT_LAZY_TYPE;
            case REACT_MEMO_TYPE:
              return REACT_MEMO_TYPE;
            case REACT_CONSUMER_TYPE:
              return isReact19() ? REACT_PROVIDER_TYPE : REACT_CONSUMER_TYPE;
            case REACT_CONTEXT_TYPE:
              return isReact19() ? REACT_PROVIDER_TYPE : REACT_CONSUMER_TYPE;
            case REACT_PROVIDER_TYPE:
              return REACT_PROVIDER_TYPE;
            case REACT_FORWARD_REF_TYPE:
              return REACT_FORWARD_REF_TYPE;
            default:
              return REACT_ELEMENT_TYPE;
          }
        }
      }

    default:
      return undefined;
  }
};

type ScalarNode = null | boolean | string | number;

/** Rebound Children.toArray with modified AbstractElement types */
const toArray: (node?: ReactNode) => Array<ScalarNode | AbstractElement> =
  Children.toArray as any;

/** Checks whether the `node` is an AbstractElement */
const isAbstractElement = (
  node: ScalarNode | AbstractElement
): node is AbstractElement => node !== null && typeof node === "object";

/** Returns a flat AbstractElement array for a given AbstractElement node */
export const getChildrenArray = (node?: ReactNode): AbstractElement[] => {
  return toArray(node).filter(isAbstractElement);
};

/** Returns merged props given a props and defaultProps object */
export const computeProps = (
  props: Record<string, unknown>,
  defaultProps?: Record<string, unknown>
) => {
  return typeof defaultProps === "object"
    ? { ...defaultProps, ...props }
    : props;
};
