import { ReactNode } from "react";
import {
  Visitor,
  ClientReferenceVisitor,
  YieldFrame,
  Frame,
  AbstractElement,
  RendererState,
} from "./types";
import { visit, update, SHOULD_YIELD } from "./visitor";
import { getChildrenArray } from "./element";

import {
  setCurrentContextStore,
  setCurrentContextMap,
  setCurrentErrorFrame,
  getCurrentErrorFrame,
  setCurrentRendererState,
  initRendererState,
  Dispatcher,
  readContextValue,
  setContextValue,
} from "./internals";

/** visit() walks all elements (depth-first) and while it walks the
    element tree some components will suspend and put a `Frame` onto
    the queue. Hence we recursively look at suspended components in
    this queue, wait for their promises to resolve, and continue
    calling visit() on their children. */
const flushFrames = (
  queue: Frame[],
  visitor: Visitor,
  clientRefVisitor: ClientReferenceVisitor,
  state: RendererState
): Promise<void> => {
  const frame = queue.shift();
  if (!frame) {
    return Promise.resolve();
  }

  if (SHOULD_YIELD && frame.kind === "frame.yield") {
    frame.thenable = new Promise<void>((resolve) => {
      setImmediate(resolve);
    });
  }

  return Promise.resolve(frame.thenable).then(
    () => {
      setCurrentRendererState(state);
      update(frame, queue, visitor, clientRefVisitor);
      return flushFrames(queue, visitor, clientRefVisitor, state);
    },
    (error: unknown) => {
      if (!frame.errorFrame) throw error;
      frame.errorFrame.error = error as Error;
      update(frame.errorFrame, queue, visitor, clientRefVisitor);
    }
  );
};

const defaultVisitor: Visitor = () => undefined;

// Type for globalThis SSR environment
interface SSRPrepassEnv {
  readContextValue: typeof readContextValue;
  setContextValue: typeof setContextValue;
}

declare global {
  var __ssrPrepassEnv: SSRPrepassEnv | undefined;
}

let runningPrepassCount = 0;

const renderPrepass = (
  element: ReactNode,
  visitor: Visitor = defaultVisitor,
  //@ts-ignore
  clientRefVisitor: ClientReferenceVisitor = defaultVisitor
): Promise<void> => {
  const queue: Frame[] = [];
  const state = initRendererState();

  setCurrentContextMap({});
  //@ts-ignore
  setCurrentContextStore(new Map());
  setCurrentErrorFrame(null);

  try {
    runningPrepassCount++;
    globalThis.__ssrPrepassEnv = { readContextValue, setContextValue };
    visit(getChildrenArray(element), queue, visitor, clientRefVisitor);
  } catch (error) {
    runningPrepassCount--;
    if (!runningPrepassCount) {
      delete globalThis.__ssrPrepassEnv;
    }
    return Promise.reject(error);
  }

  return flushFrames(queue, visitor, clientRefVisitor, state).finally(() => {
    runningPrepassCount--;
    if (!runningPrepassCount) {
      delete globalThis.__ssrPrepassEnv;
    }
  });
};

export default renderPrepass;
