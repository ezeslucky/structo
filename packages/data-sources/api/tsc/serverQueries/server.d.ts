import { ServerQuery, ServerQueryResult } from "../types";
export declare function mkStructoUndefinedServerProxy(): {
    data: {};
    isLoading: boolean;
};
export declare function executeServerQuery<F extends (...args: any[]) => any>(serverQuery: ServerQuery<F>): Promise<ServerQueryResult<ReturnType<F> | {}>>;
