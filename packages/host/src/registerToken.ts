export type TokenType =
  | "color"
  | "spacing"
  | "font-family"
  | "font-size"
  | "line-height"
  | "opacity";


  export interface TokenRegistration {
 
  name: string;

  value: string;
  type: TokenType;
  displayName?: string;
  selector?: string;
}

declare global {
  interface Window {
    __StructoTokenRegistry: TokenRegistration[];
  }
}

const root = globalThis as any;

if (root.__StructoTokenRegistry == null) {
  root.__StructoTokenRegistry = [];
}

export default function registerToken(token: TokenRegistration) {
  root.__StructoTokenRegistry.push(token);
}
