import React from "react";


export type StructoTranslator = (
    str: string,
    opts?: {
        component?: {
            [key: string]: React.ReactElement
        }
    }
) => React.ReactNode;

export interface StructoI18NContextValue {
    translator?: StructoTranslator;
    tagPrefix?: string;
}


export const StructoTranslatorContext = React.createContext<
StructoI18NContextValue | StructoTranslator | undefined
>(undefined)

export function useStructoTranslator(){
const _t = React.useContext(StructoTranslatorContext);;
const translator = _t
    ? typeof _t === "function"
      ? _t
      : _t.translator
    : undefined;
  return translator;
}