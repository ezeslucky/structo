import type {
  AbstractContext,
  UserElement,
  ContextMap,
  ContextStore,
  ContextEntry
} from '../types'

//@ts-ignore

let currentContextStore: ContextStore = new Map()
let currentContextMap: ContextMap = {}

let prevContextMap: ContextMap | undefined = undefined
let prevContextEntry: ContextEntry | undefined = undefined

export const getCurrentContextMap = (): ContextMap =>
  Object.assign({}, currentContextMap)

export const getCurrentContextStore = (): ContextStore =>
  new Map(currentContextStore)

export const flushPrevContextMap = (): ContextMap | undefined => {
  const prev = prevContextMap
  prevContextMap = undefined
  return prev
}

export const flushPrevContextStore = (): ContextEntry | undefined => {
  const prev = prevContextEntry
  prevContextEntry = undefined
  return prev
}

export const restoreContextMap = (prev?: ContextMap) => {
  if (prev !== undefined) {
    Object.assign(currentContextMap, prev)
  }
}

export const restoreContextStore = (prev?: ContextEntry) => {
  if (prev !== undefined) {
    currentContextStore.set(prev[0], prev[1])
  }
}

export const setCurrentContextMap = (map: ContextMap) => {
  prevContextMap = undefined
  currentContextMap = map
}

export const setCurrentContextStore = (store: ContextStore) => {
  prevContextEntry = undefined
  currentContextStore = store
}

export const assignContextMap = (map: ContextMap) => {
  prevContextMap = {}
  for (const name in map) {
    prevContextMap[name] = currentContextMap[name]
    currentContextMap[name] = map[name]
  }
}

export const setContextValue = (context: AbstractContext, value: unknown) => {
  prevContextEntry = [context, currentContextStore.get(context)]
  currentContextStore.set(context, value)
}

export const readContextValue = (context: AbstractContext) => {
  const value = currentContextStore.get(context)
  if (value !== undefined) {
    return value
  }

  // Return default if context has no value yet
  //@ts-ignore
  return context._currentValue
}

const emptyContext: Record<string, any> = {}

export const maskContext = (type: UserElement['type']) => {
  const { contextType, contextTypes } = type

  if (contextType) {
    return readContextValue(contextType)
  } else if (!contextTypes) {
    return emptyContext
  }

  const maskedContext: Record<string, any> = {}
  for (const name in contextTypes) {
    maskedContext[name] = currentContextMap[name]
  }

  return maskedContext
}
