import React, { ReactNode, ComponentType, createElement } from 'react';
import {
  typeOf,
  shouldConstruct,
  getChildrenArray,
  computeProps
} from './element';

import {
  mountFunctionComponent,
  updateFunctionComponent,
  mountClassComponent,
  updateClassComponent,
  mountLazyComponent,
  updateLazyComponent,
  mountClientReference,
  updateClientReference
} from './render';

import type {
  Visitor,
  ClientReferenceVisitor,
  YieldFrame,
  ClassFrame,
  Frame,
  ContextMap,
  ContextEntry,
  DefaultProps,
  ComponentStatics,
  LazyElement,
  AbstractElement,
  ConsumerElement,
  ProviderElement,
  FragmentElement,
  SuspenseElement,
  ForwardRefElement,
  MemoElement,
  UserElement,
  DOMElement,
  ClientReferenceElement,
  ClientReference
} from './types';

import {
  getCurrentContextMap,
  getCurrentContextStore,
  setCurrentContextMap,
  setCurrentContextStore,
  flushPrevContextMap,
  flushPrevContextStore,
  restoreContextMap,
  restoreContextStore,
  readContextValue,
  setContextValue,
  setCurrentIdentity,
  setCurrentErrorFrame,
  getCurrentErrorFrame,
  Dispatcher,
  setFirstHook,
  getCurrentIdentity,
  getFirstHook
} from './internals';

import {
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
  REACT_CONSUMER_TYPE
} from './symbols';

import { isClientReference, isReact19 } from './utils';

const REACT_INTERNALS: any =
  (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ||
  (React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ||
  (React as any).__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

const ReactCurrentDispatcher: any = REACT_INTERNALS.ReactCurrentDispatcher || REACT_INTERNALS;

const getReactCurrentDispatcher = () => ReactCurrentDispatcher.current || ReactCurrentDispatcher.H;

const injectReactCurrentDispatcher = (newDispatcher: any) => {
  if (!isReact19()) {
    ReactCurrentDispatcher.current = newDispatcher;
  } else {
    ReactCurrentDispatcher.H = newDispatcher;
  }
};

export const SHOULD_YIELD = typeof setImmediate === 'function';
const YIELD_AFTER_MS = 5;

const render = (
  type: ComponentType<DefaultProps> & ComponentStatics | ClientReference,
  props: DefaultProps,
  queue: Frame[],
  visitor: Visitor,
  clientRefVisitor: ClientReferenceVisitor,
  element: UserElement | ClientReferenceElement
) => {
  //@ts-ignore
  if (isClientReference(type)) {
    return mountClientReference(type as any, props, queue, clientRefVisitor, element as any);
  }
  return shouldConstruct(type as any)
    ? mountClassComponent(type as any, props, queue, visitor, element as any)
    : mountFunctionComponent(type as any, props, queue, visitor, element as any);
};

export const visitElement = (
  element: AbstractElement,
  queue: Frame[],
  visitor: Visitor,
  clientRefVisitor: ClientReferenceVisitor
): AbstractElement[] => {
  switch (typeOf(element)) {
    case REACT_SUSPENSE_TYPE:
    case REACT_STRICT_MODE_TYPE:
    case REACT_CONCURRENT_MODE_TYPE:
    case REACT_PROFILER_TYPE:
    case REACT_FRAGMENT_TYPE: {
      const fragmentElement = element as FragmentElement | SuspenseElement;
      return getChildrenArray(fragmentElement.props.children);
    }

    case REACT_PROVIDER_TYPE: {
      const providerElement = element as ProviderElement;
      const { value, children } = providerElement.props;
      const type = providerElement.type as any;
      const context = typeof type._context === 'object' ? type._context : type;
      setContextValue(context, value);
      return getChildrenArray(children);
    }

    case REACT_CONSUMER_TYPE: {
      const consumerElement = element as ConsumerElement;
      const { children } = consumerElement.props;
      if (typeof children === 'function') {
        const type = consumerElement.type as any;
        const context = typeof type._context === 'object' ? type._context : type;
        const value = readContextValue(context);
        return getChildrenArray(children(value));
      } else {
        return [];
      }
    }

    case REACT_LAZY_TYPE: {
      const lazyElement = element as LazyElement;
      const type = lazyElement.type;
      const child = mountLazyComponent(type, lazyElement.props, queue);
      return getChildrenArray(child);
    }

    case REACT_MEMO_TYPE: {
      const memoElement = element as MemoElement;
      const { type } = memoElement.type;
      const child = createElement(type as any, memoElement.props);
      return getChildrenArray(child);
    }

    case REACT_FORWARD_REF_TYPE: {
      const refElement = element as ForwardRefElement;
      const { render: type, defaultProps } = refElement.type;
      //@ts-ignore
      const props = computeProps(refElement.props, defaultProps);
      const child = createElement(type as any, props);
      return getChildrenArray(child);
    }

    case REACT_ELEMENT_TYPE: {
      const el = element as UserElement | DOMElement;
      if (typeof el.type === 'string') return getChildrenArray(el.props.children);
      const userElement = element as UserElement | ClientReferenceElement;
      const { type, props } = userElement;
      const child = render(type, props, queue, visitor, clientRefVisitor, userElement);
      return getChildrenArray(child);
    }

    case REACT_PORTAL_TYPE:
    default:
      return [];
  }
};

const visitLoop = (
  traversalChildren: AbstractElement[][],
  traversalMap: Array<void | ContextMap>,
  traversalStore: Array<void | ContextEntry>,
  traversalErrorFrame: Array<null | ClassFrame>,
  queue: Frame[],
  visitor: Visitor,
  clientRefVisitor: ClientReferenceVisitor
): boolean => {
  const prevDispatcher = getReactCurrentDispatcher();
  const start = Date.now();

  try {
    injectReactCurrentDispatcher(Dispatcher);
    while (traversalChildren.length > 0) {
      const element = traversalChildren[traversalChildren.length - 1].shift();
      if (element !== undefined) {
        const children = visitElement(element, queue, visitor, clientRefVisitor);
        traversalChildren.push(children);
        traversalMap.push(flushPrevContextMap());
        traversalStore.push(flushPrevContextStore());
        traversalErrorFrame.push(getCurrentErrorFrame());
      } else {
        traversalChildren.pop();
        //@ts-ignore
        restoreContextMap(traversalMap.pop());
        //@ts-ignore
        restoreContextStore(traversalStore.pop());
        setCurrentErrorFrame(traversalErrorFrame.pop());
      }

      if (SHOULD_YIELD && Date.now() - start > YIELD_AFTER_MS) return true;
    }
    return false;
  } catch (error) {
    const errorFrame = getCurrentErrorFrame();
    if (!errorFrame) throw error;
    errorFrame.error = error;
    queue.unshift(errorFrame);
    return false;
  } finally {
    injectReactCurrentDispatcher(prevDispatcher);
  }
};

const makeYieldFrame = (
  traversalChildren: AbstractElement[][],
  traversalMap: Array<void | ContextMap>,
  traversalStore: Array<void | ContextEntry>,
  traversalErrorFrame: Array<null | ClassFrame>
): Frame => ({
  contextMap: getCurrentContextMap(),
  contextStore: getCurrentContextStore(),
  errorFrame: getCurrentErrorFrame(),
  thenable: null,
  kind: 'frame.yield',
  traversalChildren,
  traversalMap,
  traversalStore,
  traversalErrorFrame
});

export const visit = (
  init: AbstractElement[],
  queue: Frame[],
  visitor: Visitor,
  clientRefVisitor: ClientReferenceVisitor
) => {
  const traversalChildren: AbstractElement[][] = [init];
  const traversalMap: Array<void | ContextMap> = [flushPrevContextMap()];
  const traversalStore: Array<void | ContextEntry> = [flushPrevContextStore()];
  const traversalErrorFrame: Array<null | ClassFrame> = [getCurrentErrorFrame()];

  const hasYielded = visitLoop(
    traversalChildren,
    traversalMap,
    traversalStore,
    traversalErrorFrame,
    queue,
    visitor,
    clientRefVisitor
  );

  if (hasYielded) {
    queue.unshift(
      makeYieldFrame(traversalChildren, traversalMap, traversalStore, traversalErrorFrame)
    );
  }
};

export const update = (
  frame: Frame,
  queue: Frame[],
  visitor: Visitor,
  clientRefVisitor: ClientReferenceVisitor
) => {
  if (frame.kind === 'frame.yield') {
    setCurrentIdentity(null);
    setCurrentContextMap(frame.contextMap);
    setCurrentContextStore(frame.contextStore);
    setCurrentErrorFrame(frame.errorFrame);

    const hasYielded = visitLoop(
      frame.traversalChildren,
      frame.traversalMap,
      frame.traversalStore,
      frame.traversalErrorFrame,
      queue,
      visitor,
      clientRefVisitor
    );

    if (hasYielded) {
      queue.unshift(makeYieldFrame(frame.traversalChildren, frame.traversalMap, frame.traversalStore, frame.traversalErrorFrame));
    }
  } else {
    const prevDispatcher = getReactCurrentDispatcher();
    let children: ReactNode | null = null;

    injectReactCurrentDispatcher(Dispatcher);

    try {
      switch (frame.kind) {
        case 'frame.class':
          children = updateClassComponent(queue, frame);
          break;
        case 'frame.hooks':
          children = updateFunctionComponent(queue, frame);
          break;
        case 'frame.lazy':
          children = updateLazyComponent(queue, frame);
          break;
        case 'client-ref':
          children = updateClientReference(queue, frame);
          break;
      }
    } catch (error) {
      const errorFrame = getCurrentErrorFrame();
      if (!errorFrame) throw error;
      errorFrame.error = error;
      queue.unshift(errorFrame);
      children = null;
    } finally {
      injectReactCurrentDispatcher(prevDispatcher);
    }

    visit(getChildrenArray(children), queue, visitor, clientRefVisitor);
  }
};
