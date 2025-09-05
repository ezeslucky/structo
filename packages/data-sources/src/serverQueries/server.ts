import { ServerQuery, ServerQueryResult } from "../types";
import { resolveParams } from "./common";

class StructoUndefinedServerError extends Error {
  structoType: "StructoUndefinedServerError";
  constructor(msg?: string) {
    super(msg);
    this.structoType = "StructoUndefinedServerError";
  }
}

function isStructoUndefinedServerError(
  x: any
): x is StructoUndefinedServerError {
  return (
    !!x &&
    typeof x === "object" &&
    (x as any).StructoType === "StructoUndefinedServerError"
  );
}

export function mkStructoUndefinedServerProxy() {
  return {
    data: new Proxy(
      {},
      {
        get: (_, prop) => {
          if (prop === "isUndefinedServerProxy") {
            return true;
          } else if (prop === "then") {
            return undefined;
          }
          throw new StructoUndefinedServerError("Data is not available yet");
        },
      }
    ),
    isLoading: true,
  };
}


export async function executeServerQuery<F extends (...args: any[]) => any>(
  serverQuery: ServerQuery<F>
): Promise<ServerQueryResult<ReturnType<F> | {}>> {
  const resolvedParams = resolveParams(serverQuery.execParams, (err) => {
    if (isStructoUndefinedServerError(err)) {
      return err;
    }
    throw err;
  });
  if (isStructoUndefinedServerError(resolvedParams)) {
    return mkStructoUndefinedServerProxy();
  }
  return { data: await serverQuery.fn(...resolvedParams), isLoading: false };
}
