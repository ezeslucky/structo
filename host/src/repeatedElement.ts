import { cloneElement, isValidElement } from "react";


export default function repeatedElement<T>(index: number, elt: T): T;

export default function repeatedElement<T>(isPrimary: boolean, elt: T): T;
export default function repeatedElement<T>(index: boolean | number, elt: T): T {
  return repeatedElementFn(index as any, elt);
}


let repeatedElementFn: typeof repeatedElement = (
  index: boolean | number,
  elt: any
) => {
  if (Array.isArray(elt)) {
    return elt.map((v) => repeatedElementFn(index as any, v)) as any;
  }
  if (elt && isValidElement(elt) && typeof elt !== "string") {
    return cloneElement(elt) as any;
  }
  return elt;
};

const root = globalThis as any;
export const setRepeatedElementFn: (fn: typeof repeatedElement) => void =
  root?.__Sub?.setRepeatedElementFn ??
  function (fn: typeof repeatedElement) {
    repeatedElementFn = fn;
  };
