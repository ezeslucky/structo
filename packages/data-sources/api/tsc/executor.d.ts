import { StructoDataSourceContextValue } from "@structoapp/data-sources-context";
import { DataOp, ManyRowsResult, Pagination, SingleRowResult } from "./types";
interface ExecuteOpts {
    userAuthToken?: string;
    user?: StructoDataSourceContextValue["user"];
    paginate?: Pagination;
}
export declare function executeStructoDataOp<T extends SingleRowResult | ManyRowsResult>(op: DataOp, opts?: ExecuteOpts): Promise<T>;
export {};
