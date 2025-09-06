/**
 * Element is already legacy in NextJS v15
 * https://github.com/vercel/next.js/pull/65058
 * https://github.com/facebook/react/pull/28813
 */

let Element: symbol | number = 0xeac7;
let TransitionalElement: symbol | number = 0xeac7;
let Portal: symbol | number = 0xeaca;
let Fragment: symbol | number = 0xeacb;
let StrictMode: symbol | number = 0xeacc;
let Profiler: symbol | number = 0xead2;
let ContextProvider: symbol | number = 0xeacd;
let ContextConsumer: symbol | undefined;
let Context: symbol | number = 0xeace;
let ConcurrentMode: symbol | number = 0xeacf;
let ForwardRef: symbol | number = 0xead0;
let Suspense: symbol | number = 0xead1;
let Memo: symbol | number = 0xead3;
let Lazy: symbol | number = 0xead4;
let ClientReferenceTag: symbol | undefined;

if (typeof Symbol === "function" && Symbol.for) {
  const symbolFor = Symbol.for;
  Element = symbolFor("react.element");
  TransitionalElement = symbolFor("react.transitional.element");
  Portal = symbolFor("react.portal");
  Fragment = symbolFor("react.fragment");
  StrictMode = symbolFor("react.strict_mode");
  Profiler = symbolFor("react.profiler");
  ContextProvider = symbolFor("react.provider");
  ContextConsumer = symbolFor("react.consumer");
  Context = symbolFor("react.context");
  ConcurrentMode = symbolFor("react.concurrent_mode");
  ForwardRef = symbolFor("react.forward_ref");
  Suspense = symbolFor("react.suspense");
  Memo = symbolFor("react.memo");
  Lazy = symbolFor("react.lazy");
  ClientReferenceTag = symbolFor("react.client.reference");
}

/** Literal types representing the ReactSymbol values */
export type ReactSymbol =
  | "react.element"
  | "react.transitional.element"
  | "react.portal"
  | "react.fragment"
  | "react.strict_mode"
  | "react.profiler"
  | "react.provider"
  | "react.consumer"
  | "react.context"
  | "react.concurrent_mode"
  | "react.forward_ref"
  | "react.suspense"
  | "react.memo"
  | "react.lazy"
  | "react.client.reference";

export const REACT_ELEMENT_TYPE: ReactSymbol = Element as any;
export const REACT_TRANSITIONAL_ELEMENT_TYPE: ReactSymbol =
  TransitionalElement as any;
export const REACT_PORTAL_TYPE: ReactSymbol = Portal as any;
export const REACT_FRAGMENT_TYPE: ReactSymbol = Fragment as any;
export const REACT_STRICT_MODE_TYPE: ReactSymbol = StrictMode as any;
export const REACT_PROFILER_TYPE: ReactSymbol = Profiler as any;
export const REACT_PROVIDER_TYPE: ReactSymbol = ContextProvider as any;
export const REACT_CONSUMER_TYPE: ReactSymbol = ContextConsumer as any;
export const REACT_CONTEXT_TYPE: ReactSymbol = Context as any;
export const REACT_CONCURRENT_MODE_TYPE: ReactSymbol = ConcurrentMode as any;
export const REACT_FORWARD_REF_TYPE: ReactSymbol = ForwardRef as any;
export const REACT_SUSPENSE_TYPE: ReactSymbol = Suspense as any;
export const REACT_MEMO_TYPE: ReactSymbol = Memo as any;
export const REACT_LAZY_TYPE: ReactSymbol = Lazy as any;
export const CLIENT_REFERENCE_TAG: ReactSymbol = ClientReferenceTag as any;
