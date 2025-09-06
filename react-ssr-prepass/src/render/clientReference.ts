import React, { ReactNode, createElement, Fragment } from 'react'
import { computeProps, getChildrenArray, typeOf } from '../element'

import type {
  Visitor,
  Hook,
  Frame,
  DefaultProps,
  ComponentStatics,
  UserElement,
  ClientReference,
  ClientReferenceElement,
  ClientReferenceVisitor,
  ClientRefFrame
} from '../types'

import {
  maskContext,
  makeIdentity,
  setCurrentIdentity,
  getCurrentIdentity,
  setCurrentContextStore,
  getCurrentContextStore,
  setCurrentContextMap,
  getCurrentContextMap,
  setCurrentErrorFrame,
  getCurrentErrorFrame,
  renderWithHooks,
  setFirstHook,
  getFirstHook
} from '../internals'
import { getComponentName } from '../utils'

// Render a client reference via visitor
const render = (
  type: ClientReference,
  props: DefaultProps,
  queue: Frame[],
  clientRefVisitor: ClientReferenceVisitor,
  element: ClientReferenceElement
): ReactNode => {
  try {
    const node = clientRefVisitor(element as any)
//@ts-ignore
    return createElement(Fragment, {}, [
      
      ...(node
        ? getChildrenArray(node as any)
        : Object.values(props)
            .flat(Infinity)
            .filter(
              //@ts-ignore
              (elt): elt is object =>
                !!elt && typeof elt === 'object' && !!typeOf(elt as any)
            ))
    ])
  } catch (error) {
    if (!(error instanceof Promise)) {
      console.warn(
        `PLASMIC: Encountered error when pre-rendering client reference: ${error}`
      )
      return null
    }

    queue.push({
      contextMap: getCurrentContextMap(),
      contextStore: getCurrentContextStore(),
      errorFrame: getCurrentErrorFrame(),
      id: getCurrentIdentity(),
      hook: getFirstHook(),
      thenable: error,
      kind: 'client-ref',
      type,
      props,
      element,
      clientRefVisitor
    } as ClientRefFrame)

    return null
  }
}

export const mount = (
  type: ClientReference,
  props: DefaultProps,
  queue: Frame[],
  clientRefVisitor: ClientReferenceVisitor,
  element: ClientReferenceElement
): ReactNode => {
  setFirstHook(null)
  setCurrentIdentity(makeIdentity())

  return render(type, props, queue, clientRefVisitor, element)
}

export const update = (queue: Frame[], frame: ClientRefFrame): ReactNode => {
  setFirstHook(frame.hook)
  setCurrentIdentity(frame.id)
  setCurrentContextMap(frame.contextMap)
  setCurrentContextStore(frame.contextStore)
  setCurrentErrorFrame(frame.errorFrame)

  return render(
    frame.type,
    frame.props,
    queue,
    frame.clientRefVisitor,
    frame.element
  )
}
