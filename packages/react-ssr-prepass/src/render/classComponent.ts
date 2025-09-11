import { ReactNode, ComponentType } from 'react'
import { computeProps } from '../element'

import type {
  Visitor,
  Frame,
  ClassFrame,
  DefaultProps,
  ComponentStatics,
  UserElement
} from '../types'

import {
  maskContext,
  assignContextMap,
  setCurrentIdentity,
  setCurrentContextMap,
  getCurrentContextMap,
  setCurrentContextStore,
  getCurrentContextStore,
  setCurrentErrorFrame,
  getCurrentErrorFrame
} from '../internals'
import { getComponentName } from '../utils'

const RE_RENDER_LIMIT = 25

type Updater = {
  _thrown: number
  queue: Array<any>
  isMounted: () => boolean
  enqueueForceUpdate: () => void
  enqueueReplaceState: (instance: any, completeState: any) => void
  enqueueSetState: (instance: any, currentPartialState: any) => void
}

const createUpdater = (): Updater => {
  const queue: any[] = []

  return {
    _thrown: 0,
    queue,
    isMounted: () => false,
    enqueueForceUpdate: () => {},
    enqueueReplaceState: (instance, completeState) => {
      if (instance._isMounted) {
        queue.length = 0
        queue.push(completeState)
      }
    },
    enqueueSetState: (instance, currentPartialState) => {
      if (instance._isMounted) {
        queue.push(currentPartialState)
      }
    }
  }
}

const flushEnqueuedState = (instance: any) => {
  const queue: any[] = instance.updater.queue

  if (queue.length > 0) {
    let nextState = { ...instance.state }

    for (let i = 0; i < queue.length; i++) {
      const partial = queue[i]
      const partialState =
        typeof partial === 'function'
          ? partial.call(instance, nextState, instance.props, instance.context)
          : partial
      if (partialState !== null) {
        Object.assign(nextState, partialState)
      }
    }

    instance.state = nextState
    queue.length = 0
  }
}

const createInstance = (type: any, props: DefaultProps) => {
  const updater = createUpdater()
  const computedProps = computeProps(props, type.defaultProps)
  const context = maskContext(type)
  const instance = new type(computedProps, context, updater)

  instance.props = computedProps
  instance.context = context
  instance.updater = updater
  instance._isMounted = true

  if (instance.state === undefined) instance.state = null

  if (typeof instance.componentDidCatch === 'function' || typeof type.getDerivedStateFromError === 'function') {
    const frame = makeFrame(type, instance, null)
    frame.errorFrame = frame
    setCurrentErrorFrame(frame)
  }

  if (typeof type.getDerivedStateFromProps === 'function') {
    const state = type.getDerivedStateFromProps(instance.props, instance.state)
    if (state != null) {
      instance.state = { ...instance.state, ...state }
    }
  } else if (typeof instance.componentWillMount === 'function') {
    instance.componentWillMount()
  } else if (typeof instance.UNSAFE_componentWillMount === 'function') {
    instance.UNSAFE_componentWillMount()
  }

  return instance
}

const makeFrame = (type: any, instance: any, thenable: Promise<any> | null): ClassFrame => ({
  contextMap: getCurrentContextMap(),
  contextStore: getCurrentContextStore(),
  errorFrame: getCurrentErrorFrame(),
  thenable,
  kind: 'frame.class',
  error: null,
  instance,
  type
})

const render = (type: any, instance: any, queue: Frame[]): ReactNode => {
  flushEnqueuedState(instance)
  let child: ReactNode = null

  try {
    child = instance.render()
  } catch (error: any) {
    if (typeof error.then !== 'function') {
      console.warn(
        `STRUCTO: Encountered error when pre-rendering component ${getComponentName(
          type
        )}. This is fine as long as you are not fetching data with @structoapp/query inside this component.  Error: ${error}`
      )
      return null
    }

    queue.push(makeFrame(type, instance, error))
    return null
  }

  if (type.childContextTypes !== undefined && typeof instance.getChildContext === 'function') {
    const childContext = instance.getChildContext()
    if (childContext != null && typeof childContext === 'object') {
      assignContextMap(childContext)
    }
  }

  if (
    typeof instance.getDerivedStateFromProps !== 'function' &&
    (typeof instance.componentWillMount === 'function' || typeof instance.UNSAFE_componentWillMount === 'function') &&
    typeof instance.componentWillUnmount === 'function'
  ) {
    try {
      instance.componentWillUnmount()
    } catch {}
  }

  instance._isMounted = false
  return child
}

export const mount = (
  type: ComponentType<DefaultProps> & ComponentStatics,
  props: DefaultProps,
  queue: Frame[],
  visitor: Visitor,
  element: UserElement
): ReactNode => {
  setCurrentIdentity(null)

  const instance = createInstance(type, props)
  const promise = visitor(element, instance)
  if (promise) {
    queue.push(makeFrame(type, instance, promise))
    return null
  }

  return render(type, instance, queue)
}

export const update = (queue: Frame[], frame: ClassFrame): ReactNode => {
  setCurrentIdentity(null)
  setCurrentContextMap(frame.contextMap)
  setCurrentContextStore(frame.contextStore)
  setCurrentErrorFrame(frame.errorFrame)

  if (frame.error) {
    //@ts-ignore
    if (++frame.instance.updater._thrown >= RE_RENDER_LIMIT) return null
//@ts-ignore
    frame.instance._isMounted = true
//@ts-ignore
    if (typeof frame.instance.componentDidCatch === 'function') {
      //@ts-ignore
      frame.instance.componentDidCatch(frame.error)
    }

    if (typeof frame.type.getDerivedStateFromError === 'function') {
      //@ts-ignore
      frame.instance.updater.enqueueSetState(
        frame.instance,
        frame.type.getDerivedStateFromError(frame.error)
      )
    }
  }

  return render(frame.type, frame.instance, queue)
}
