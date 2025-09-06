import { ReactNode, Context, ComponentType } from "react";
import {
  REACT_ELEMENT_TYPE,
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
  REACT_TRANSITIONAL_ELEMENT_TYPE,
} from "../symbols";

export type AbstractContext = Context<any> & {
  $$typeof: typeof REACT_CONTEXT_TYPE;
  _currentValue: any;
  _threadCount: number;
};

export type DefaultProps = {
  children?: ReactNode;
};

export type ComponentStatics = {
  getDerivedStateFromProps?: (props: object, state: any) => any;
  getDerivedStateFromError?: (error: Error) => any;
  contextType?: AbstractContext;
  contextTypes?: object;
  childContextTypes?: object;
  defaultProps?: object;
};

type ElementTypeof =
  | typeof REACT_ELEMENT_TYPE
  | typeof REACT_TRANSITIONAL_ELEMENT_TYPE;

/** <Context.Consumer> */
export type ConsumerElement = {
  type:
    | AbstractContext
    | {
        $$typeof: typeof REACT_CONSUMER_TYPE;
        _context: AbstractContext;
      };
  props: { children?: (value: any) => ReactNode };
  $$typeof: ElementTypeof;
};

/** <Context.Provider> */
export type ProviderElement = {
  type: {
    $$typeof: typeof REACT_PROVIDER_TYPE;
    _context: AbstractContext;
  };
  props: DefaultProps & { value: any };
  $$typeof: ElementTypeof;
};

/** <Suspense> */
export type SuspenseElement = {
  type: typeof REACT_SUSPENSE_TYPE;
  props: DefaultProps & { fallback?: ReactNode };
  $$typeof: ElementTypeof;
};

/** <ConcurrentMode>, <Fragment>, <Profiler>, <StrictMode> */
export type FragmentElement = {
  type:
    | typeof REACT_CONCURRENT_MODE_TYPE
    | typeof REACT_FRAGMENT_TYPE
    | typeof REACT_PROFILER_TYPE
    | typeof REACT_STRICT_MODE_TYPE;
  props: DefaultProps;
  $$typeof: ElementTypeof;
};

type LazyComponentUninitialized = {
  _status: -1;
  _result: () => Promise<any>;
};

type LazyComponentPending = {
  _status: 0;
  _result: Promise<any>;
};

type LazyComponentResolved = {
  _status: 1;
  _result: ComponentType<DefaultProps> & ComponentStatics;
};

type LazyComponentRejected = {
  _status: 2;
  _result: any;
};

export type LazyComponentPayload =
  | LazyComponentUninitialized
  | LazyComponentPending
  | LazyComponentResolved
  | LazyComponentRejected;

type LazyComponentLegacy = {
  $$typeof: typeof REACT_LAZY_TYPE;
  _ctor: () => Promise<any>;
  _status: -1 | 0 | 1 | 2;
  _result: any;
};

type LazyComponentModern = {
  $$typeof: typeof REACT_LAZY_TYPE;
  _payload: LazyComponentPayload;
};

export type LazyComponent = LazyComponentLegacy | LazyComponentModern;

/** <React.lazy(Comp)> */
export type LazyElement = {
  $$typeof: typeof REACT_LAZY_TYPE;
  props: DefaultProps;
  type: LazyComponent;
};

/** <React.memo(Comp)> */
export type MemoElement = {
  type: {
    type: ComponentType<DefaultProps> & ComponentStatics;
    $$typeof: typeof REACT_MEMO_TYPE;
  };
  props: DefaultProps;
  $$typeof: ElementTypeof;
};

/** <React.forwardRef(Comp)> */
export type ForwardRefElement = {
  type: {
    render: ComponentType<DefaultProps> & ComponentStatics;
    $$typeof: typeof REACT_FORWARD_REF_TYPE;
    defaultProps?: object;
    styledComponentId?: string;
    target?: ComponentType<any> | string;
  };
  props: DefaultProps;
  $$typeof: ElementTypeof;
};

/** Portal */
export type PortalElement = {
  $$typeof: typeof REACT_PORTAL_TYPE;
  containerInfo: any;
  children: ReactNode;
};

/** <YourComponent /> */
export type UserElement = {
  type: ComponentType<DefaultProps> & ComponentStatics;
  props: DefaultProps;
  $$typeof: ElementTypeof;
};

export type ClientReference = {
  $$typeof: symbol;
  $$id: string;
  $$async: boolean;
};

export type ClientReferenceElement = {
  type: ClientReference;
  props: DefaultProps;
  $$typeof: ElementTypeof;
};

/** <div /> */
export type DOMElement = {
  type: string;
  props: DefaultProps;
  $$typeof: ElementTypeof;
};

/** This is like React.Element<any> but with specific symbol fields */
export type AbstractElement =
  | ConsumerElement
  | ProviderElement
  | FragmentElement
  | LazyElement
  | ForwardRefElement
  | MemoElement
  | UserElement
  | DOMElement
  | PortalElement
  | SuspenseElement
  | ClientReferenceElement;

/** TS replacement for Flow’s $NonMaybeType */
export type NonNullableType<T> = T extends null | undefined ? never : T;

export type MutableSourceGetSnapshotFn<
  Source,
  Snapshot
> = (source: NonNullableType<Source>) => Snapshot;

export type MutableSourceSubscribeFn<Source, Snapshot> = (
  source: NonNullableType<Source>,
  callback: (snapshot: Snapshot) => void
) => () => void;

export type MutableSource<Source> = {
  _source: NonNullableType<Source>;
};
