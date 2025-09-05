const root = globalThis as any;

export interface BasicTrait {
  label?: string;
  type: "text" | "number" | "boolean";
}

export interface ChoiceTrait {
  label?: string;
  type: "choice";
  options: string[];
}

export type TraitMeta = BasicTrait | ChoiceTrait;

export interface TraitRegistration {
  trait: string;
  meta: TraitMeta;
}

declare global {
  interface Window {
    __StructoTraitRegistry: TraitRegistration[];
  }
}

if(root.__StructoTraitRegistry == null){
    root.__StructoTraitRegistry = []
}



export default function registerTrait(trait: string, meta: TraitMeta) {
  root.__StructoTraitRegistry.push({
    trait,
    meta,
  });
}
