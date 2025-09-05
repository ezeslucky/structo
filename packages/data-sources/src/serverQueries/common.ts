
export function resolveParams<F extends (...args: any[]) => any, E>(
  params: () => Parameters<F>,
  errorFn: (err: unknown) => E
): Parameters<F> | E {
  try {
    return params();
  } catch (err) {
    return errorFn(err);
  }
}
