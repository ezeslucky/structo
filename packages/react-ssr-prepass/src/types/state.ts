import { AbstractContext } from "./element";

export type ContextStore = Map<AbstractContext, unknown>;
export type ContextMap = { [name: string]: unknown };
export type ContextEntry = [AbstractContext, unknown];

export type Dispatch<A> = (action: A) => void;

export type BasicStateAction<S> = ((prevState: S) => S) | S;

export type Update<A> = {
  action: A;
  next: Update<A> | null;
};

export type UpdateQueue<A> = {
  last: Update<A> | null;
  dispatch: Dispatch<A> | null;
};

export type Hook = {
  memoizedState: unknown;
  queue: UpdateQueue<unknown> | null;
  next: Hook | null;
};
