import type { ClassFrame } from '../types'

/** The current error boundary frame determines where to continue rendering when an error is raised */
let currentErrorFrame: ClassFrame | null = null

export const getCurrentErrorFrame = (): ClassFrame | null => currentErrorFrame

export const setCurrentErrorFrame = (frame: ClassFrame | null = null): void => {
  currentErrorFrame = frame
}
