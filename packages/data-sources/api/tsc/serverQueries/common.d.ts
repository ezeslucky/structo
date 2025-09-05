export declare function resolveParams<F extends (...args: any[]) => any, E>(params: () => Parameters<F>, errorFn: (err: unknown) => E): Parameters<F> | E;
