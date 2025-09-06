import { readContextValue } from './context'
import { rendererStateRef } from './state'
import is from './objectIs'
import type {
  MutableSource,
  MutableSourceGetSnapshotFn,
  MutableSourceSubscribeFn,
  AbstractContext,
  BasicStateAction,
  Dispatch,
  Update,
  UpdateQueue,
  Hook
} from '../types'

export type Identity = {}
export type OpaqueIDType = string

let currentIdentity: Identity | null = null

export const makeIdentity = (): Identity => ({})

export const setCurrentIdentity = (id: Identity | null) => {
  currentIdentity = id
}

export const getCurrentIdentity = (): Identity => {
  if (currentIdentity === null) {
    throw new Error(
      '[react-ssr-prepass] Hooks can only be called inside the body of a function component. ' +
        '(https://fb.me/react-invalid-hook-call)'
    )
  }
  return currentIdentity
}

let firstWorkInProgressHook: Hook | null = null
let workInProgressHook: Hook | null = null
let didScheduleRenderPhaseUpdate = false
let renderPhaseUpdates: Map<UpdateQueue<any>, Update<any>> | null = null
let numberOfReRenders = 0
const RE_RENDER_LIMIT = 25

export const getFirstHook = (): Hook | null => firstWorkInProgressHook
export const setFirstHook = (hook: Hook | null) => {
  firstWorkInProgressHook = hook
}

function areHookInputsEqual(nextDeps: any[], prevDeps: any[] | null): boolean {
  if (prevDeps === null) return false
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (!is(nextDeps[i], prevDeps[i])) return false
  }
  return true
}

function createHook(): Hook {
  return {
    memoizedState: null,
    queue: null,
    next: null
  }
}

function createWorkInProgressHook(): Hook {
  if (workInProgressHook === null) {
    if (firstWorkInProgressHook === null) {
      return (firstWorkInProgressHook = workInProgressHook = createHook())
    } else {
      return (workInProgressHook = firstWorkInProgressHook)
    }
  } else {
    if (workInProgressHook.next === null) {
      return (workInProgressHook = workInProgressHook.next = createHook())
    } else {
      return (workInProgressHook = workInProgressHook.next)
    }
  }
}

export function renderWithHooks<P>(
  Component: (props: P, refOrContext?: any) => any,
  props: P,
  refOrContext?: any
): any {
  workInProgressHook = null
  let children = Component(props, refOrContext)

  while (numberOfReRenders < RE_RENDER_LIMIT && didScheduleRenderPhaseUpdate) {
    didScheduleRenderPhaseUpdate = false
    numberOfReRenders += 1
    workInProgressHook = null
    children = Component(props, refOrContext)
  }

  numberOfReRenders = 0
  renderPhaseUpdates = null
  workInProgressHook = null

  return children
}

function readContext(context: AbstractContext): any {
  return readContextValue(context)
}

function useContext(context: AbstractContext): any {
  getCurrentIdentity()
  return readContextValue(context)
}

function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === 'function' ? (action as (s: S) => S)(state) : action
}

function useState<S>(initialState: (() => S) | S): [S, Dispatch<BasicStateAction<S>>] {
  return useReducer(basicStateReducer, initialState as any)
}

function useReducer<S, I, A>(
  reducer: (state: S, action: A) => S,
  initialArg: I,
  init?: (arg: I) => S
): [S, Dispatch<A>] {
  const id = getCurrentIdentity()
  workInProgressHook = createWorkInProgressHook()

  if (workInProgressHook.queue === null) {
    let initialState: S
    if (reducer === basicStateReducer) {
      //@ts-ignore
      initialState = typeof initialArg === 'function' ? (initialArg as () => S)() : (initialArg as S)
    } else {
      //@ts-ignore
      initialState = init !== undefined ? init(initialArg) : (initialArg as S)
    }
    workInProgressHook.memoizedState = initialState
  }
//@ts-ignore
  const queue: UpdateQueue<A> =
    workInProgressHook.queue || (workInProgressHook.queue = { last: null, dispatch: null })
  const dispatch: Dispatch<A> =
    queue.dispatch || (queue.dispatch = dispatchAction.bind(null, id, queue))

  if (renderPhaseUpdates !== null) {
    const firstRenderPhaseUpdate = renderPhaseUpdates.get(queue)
    if (firstRenderPhaseUpdate !== undefined) {
      renderPhaseUpdates.delete(queue)
      let newState = workInProgressHook.memoizedState
      let update: Update<A> | null = firstRenderPhaseUpdate
      while (update !== null) {
        //@ts-ignore
        newState = reducer(newState, update.action)
        update = update.next
      }
      workInProgressHook.memoizedState = newState
    }
  }
//@ts-ignore
  return [workInProgressHook.memoizedState, dispatch]
}

function useMemo<T>(nextCreate: () => T, deps?: Array<any> | null): T {
  getCurrentIdentity()
  workInProgressHook = createWorkInProgressHook()

  const nextDeps = deps ?? null
  const prevState = workInProgressHook.memoizedState
  if (prevState !== null && nextDeps !== null) {
    //@ts-ignore
    const prevDeps = prevState[1]
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      //@ts-ignore
      return prevState[0]
    }
  }

  const nextValue = nextCreate()
  workInProgressHook.memoizedState = [nextValue, nextDeps]
  return nextValue
}

function useRef<T>(initialValue: T): { current: T } {
  getCurrentIdentity()
  workInProgressHook = createWorkInProgressHook()
  const previousRef = workInProgressHook.memoizedState as { current: T } | null
  if (previousRef === null) {
    const ref = { current: initialValue }
    workInProgressHook.memoizedState = ref
    return ref
  }
  return previousRef
}

function useOpaqueIdentifier(): OpaqueIDType {
  getCurrentIdentity()
  workInProgressHook = createWorkInProgressHook()
  if (!workInProgressHook.memoizedState) {
    workInProgressHook.memoizedState =
    //@ts-ignore
      'R:' + rendererStateRef.current.uniqueID++;toString(36)
  }
  //@ts-ignore
  return workInProgressHook.memoizedState
}

function dispatchAction<A>(componentIdentity: Identity, queue: UpdateQueue<A>, action: A) {
  if (componentIdentity === currentIdentity) {
    didScheduleRenderPhaseUpdate = true
    const update: Update<A> = { action, next: null }
    if (renderPhaseUpdates === null) {
      renderPhaseUpdates = new Map()
    }
    const firstUpdate = renderPhaseUpdates.get(queue)
    if (!firstUpdate) {
      renderPhaseUpdates.set(queue, update)
    } else {
      let last = firstUpdate
      while (last.next !== null) last = last.next
      last.next = update
    }
  }
}

function useCallback<T>(callback: T, deps?: Array<any> | null): T {
  return useMemo(() => callback, deps)
}

function useMutableSource<Source, Snapshot>(
  source: MutableSource<Source>,
  getSnapshot: MutableSourceGetSnapshotFn<Source, Snapshot>,
  _subscribe: MutableSourceSubscribeFn<Source, Snapshot>
): Snapshot {
  getCurrentIdentity()
  return getSnapshot(source._source)
}

function noop(): void {}

function useTransition(): [(callback: () => void) => void, boolean] {
  return [(callback) => callback(), false]
}

function useDeferredValue<T>(input: T): T {
  return input
}

function useSyncExternalStore<T>(
  subscribe: ((callback: () => void) => () => void),
  getSnapshot: () => T,
  getServerSnapshot?: () => T
): T {
  return getSnapshot()
}

export const Dispatcher = {
  readContext,
  useSyncExternalStore,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
  useCallback,
  useMutableSource,
  useTransition,
  useDeferredValue,
  useOpaqueIdentifier,
  useId: useOpaqueIdentifier,
  unstable_useId: useOpaqueIdentifier,
  unstable_useOpaqueIdentifier: useOpaqueIdentifier,
  useLayoutEffect: noop,
  useImperativeHandle: noop,
  useEffect: noop,
  useDebugValue: noop,
  useInsertionEffect: noop,
  isPlasmicPrepass: true
}
