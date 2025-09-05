export { useStructoDataConfig } from "@Structoapp/query";
export { Fetcher, FetcherMeta } from "./components/Fetcher";
export type { FetcherProps } from "./components/Fetcher";
export { executeStructoDataOp } from "./executor";
export {
  deriveFieldConfigs,
  normalizeData,
  useNormalizedData,
} from "./helpers";
export type { BaseFieldConfig, NormalizedData, QueryResult } from "./helpers";
export { useDependencyAwareQuery } from "./hooks/useDependencyAwareQuery";
export {
  makeCacheKey,
  useStructoDataMutationOp,
  useStructoDataOp,
  useStructoInvalidate,
} from "./hooks/useStructoDataOp";
export {
  makeQueryCacheKey,
  useStructoServerQuery,
} from "./serverQueries/client";
export {
  executeServerQuery,
  mkStructoUndefinedServerProxy,
} from "./serverQueries/server";
export type {
  ClientQueryResult,
  DataOp,
  DataSourceSchema,
  ManyRowsResult,
  Pagination,
  ServerQuery,
  ServerQueryResult,
  SingleRowResult,
  TableFieldSchema,
  TableFieldType,
  TableSchema,
} from "./types";
