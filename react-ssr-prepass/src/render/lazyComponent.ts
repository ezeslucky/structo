import React, { createElement, ReactNode } from 'react'
import type {
  LazyComponent,
  LazyComponentPayload,
  DefaultProps,
  LazyFrame,
  Frame
} from '../types'
import { getChildrenArray } from '../element'

import {
  setCurrentIdentity,
  setCurrentContextStore,
  getCurrentContextStore,
  setCurrentContextMap,
  getCurrentContextMap,
  setCurrentErrorFrame,
  getCurrentErrorFrame
} from '../internals'

const resolve = (type: LazyComponent): Promise<void> => {
  //@ts-ignore
  const payload = (type._payload || (type as any)) as LazyComponentPayload
  if (payload._status === 0) {
    return payload._result
  } else if (payload._status === 1) {
    //@ts-ignore
    return Promise.resolve(payload._result)
  } else if (payload._status === 2) {
    return Promise.reject(payload._result)
  }
//@ts-ignore
  payload._status = 0 /* PENDING */
//@ts-ignore
  return (payload._result = (payload._ctor || payload._result)()
    .then((Component) => {
      payload._result = Component
      if (typeof Component === 'function') {
        //@ts-ignore
        payload._status = 1 /* SUCCESSFUL */
      } else if (
        Component !== null &&
        typeof Component === 'object' &&
        typeof (Component as any).default === 'function'
      ) {
        payload._result = (Component as any).default
        //@ts-ignore
        payload._status = 1 /* SUCCESSFUL */
      } else {
        //@ts-ignore
        payload._status = 2 /* FAILED */
      }
    })
    .catch((error) => {
      //@ts-ignore
      payload._status = 2 /* FAILED */
      payload._result = error
      return Promise.reject(error)
    }))
}

const makeFrame = (
  type: LazyComponent,
  props: DefaultProps,
  thenable: Promise<any>
) => ({
  kind: 'frame.lazy' as const,
  contextMap: getCurrentContextMap(),
  contextStore: getCurrentContextStore(),
  errorFrame: getCurrentErrorFrame(),
  thenable,
  props,
  type
})

const render = (type: LazyComponent, props: DefaultProps, queue: Frame[]): ReactNode => {
  //@ts-ignore
  const payload = (type._payload || (type as any)) as LazyComponentPayload
  if (payload._status === 1 && payload._result) {
    return createElement(payload._result, props)
  }

  try {
    return createElement((type as any)._init((type as any)._payload), props)
  } catch (err: any) {
    if (err && typeof err.then === 'function') {
      queue.push(makeFrame(type, props, err))
    }
    return null
  }
}

export const mount = (type: LazyComponent, props: DefaultProps, queue: Frame[]): ReactNode => {
  //@ts-ignore
  const payload = (type._payload || (type as any)) as LazyComponentPayload
  if (payload._status != null && payload._status <= 0) {
    queue.push(makeFrame(type, props, resolve(type)))
    return null
  }

  return render(type, props, queue)
}

export const update = (queue: Frame[], frame: LazyFrame): ReactNode => {
  setCurrentIdentity(null)
  setCurrentContextMap(frame.contextMap)
  setCurrentContextStore(frame.contextStore)
  setCurrentErrorFrame(frame.errorFrame)
  return render(frame.type, frame.props, queue)
}
