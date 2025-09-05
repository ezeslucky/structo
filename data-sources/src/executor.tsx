import { StructoDataSourceContextValue } from "@structoapp/data-sources-context";
import fetch from "@structoapp/isomorphic-unfetch";
import { wrapLoadingFetcher } from "@structoapp/query";
import stringify from "fast-stringify";
import { addPlaceholdersToUserArgs } from "./placeholders";
import { DataOp, ManyRowsResult, Pagination, SingleRowResult } from "./types";

const DEFAULT_HOST = "https://data.structo.app";

interface ExecuteOpts {
  userAuthToken?: string;
  user?: StructoDataSourceContextValue["user"];
  paginate?: Pagination;
}

const UNAUTHORIZED_MESSAGE =
  "You do not have permission to perform this operation. Login to get access or contact the app owner to get access.";

export async function executeStructoDataOp<
  T extends SingleRowResult | ManyRowsResult
>(op: DataOp, opts?: ExecuteOpts) {
  const func = getConfig(
    "__STRUCTO_EXECUTE_DATA_OP",
    _executeStructoDataOp
  ) as typeof _executeStructoDataOp;
  op.userArgs = addPlaceholdersToUserArgs(op.userArgs);
  const res = await wrapLoadingFetcher(func)(op, opts);
  return res as T;
}

async function _executeStructoDataOp<
  T extends SingleRowResult | ManyRowsResult
>(op: DataOp, opts?: ExecuteOpts) {
  if (op.roleId) {
    if (!opts?.user || !opts.user.roleIds.includes(op.roleId)) {
      console.error(UNAUTHORIZED_MESSAGE);
      throw new Error(UNAUTHORIZED_MESSAGE);
    }
  }

  const host = getConfig("__STRUCTO_DATA_HOST", DEFAULT_HOST);

  const url = `${host}/api/v1/server-data/sources/${op.sourceId}/execute`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(opts?.userAuthToken && {
        "x-structo-data-user-auth-token": opts.userAuthToken,
      }),
    },
    body: stringify({
      opId: op.opId,
      userArgs: op.userArgs ?? {},
      paginate: opts?.paginate,
    }),
  });
  if (resp.status !== 200) {
    const text = await resp.text();
    throw new Error(text);
  }
  return (await resp.json()) as T;
}

function getConfig<T>(key: string, defaultValue: T) {
  if (typeof globalThis === "undefined") {
    return defaultValue;
  } else {
    return (globalThis as any)[key] ?? defaultValue;
  }
}
