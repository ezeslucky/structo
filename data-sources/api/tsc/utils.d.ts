export declare function swallow<T>(f: () => T): T | undefined;
export declare function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;
type ReactElt = {
    children: ReactElt | ReactElt[];
    props: {
        children: ReactElt | ReactElt[];
        [prop: string]: any;
    } | null;
    type: React.ComponentType<any> | null;
    key: string | null;
} | null;
export declare function traverseReactEltTree(children: React.ReactNode, callback: (elt: ReactElt) => void): void;
export declare function asArray<T>(x: T[] | T | undefined | null): T[];
export declare function ensureNumber(x: number | string): number;
export declare function ensure<T>(x: T | null | undefined, msg: string): T;
export declare function isOneOf<T, U extends T>(elem: T, arr: readonly U[]): elem is U;
export declare function maybe<T, U>(x: T | undefined | null, f: (y: T) => U): U | undefined;
export declare function isLikeImage(value: unknown): false | RegExpMatchArray | null;
export declare function ensureArray<T>(xs: T | T[]): T[];
export declare const tuple: <T extends any[]>(...args: T) => T;
export interface HasId {
    id: string;
}
export declare function mkIdMap<T extends HasId>(xs: ReadonlyArray<T>): Map<string, T>;
export declare const mkShortId: () => string;
export declare function withoutNils<T>(xs: Array<T | undefined | null>): T[];
export type Falsey = null | undefined | false | "" | 0 | 0n;
export type Truthy<T> = T extends Falsey ? never : T;
export declare function withoutFalsey<T>(xs: Array<T | Falsey>): T[];
export {};
