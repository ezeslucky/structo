import { shouldConstruct } from "./element";
import { CLIENT_REFERENCE_TAG } from "./symbols";
import React, { ComponentType } from "react";
import { DefaultProps, ComponentStatics } from "./types";

/** Checks if a reference is a client reference */
export function isClientReference(reference: { $$typeof?: symbol }): boolean {
  //@ts-ignore
  return reference.$$typeof === CLIENT_REFERENCE_TAG;
}

/** Gets the component's display name or fallback name */
export const getComponentName = (
  type: ComponentType<DefaultProps> & ComponentStatics
): string | undefined => {
  //@ts-ignore
  if (isClientReference(type)) {
    return undefined;
  }
  if ((type as any).displayName) {
    return (type as any).displayName;
  }
  if (shouldConstruct(type)) {
    return (type as any).constructor?.name;
  } else {
    return type.name;
  }
};

/** Detects if React version is < 18 (React 19 detection) */
export function isReact19(): boolean {
  return !(React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
}
