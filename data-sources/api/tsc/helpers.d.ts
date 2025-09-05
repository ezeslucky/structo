import { ManyRowsResult, TableFieldSchema, TableSchema } from "./types";
export type QueryResult = Partial<ManyRowsResult<any>> & {
    error?: any;
    isLoading?: boolean;
};
export interface NormalizedData {
    data: Record<string, unknown>[];
    schema?: TableSchema;
}
export declare function normalizeData(rawData: unknown): NormalizedData | undefined;
export declare function useNormalizedData(rawData: unknown): NormalizedData | undefined;
export type BaseFieldConfig = {
    key?: string;
    fieldId?: string;
};
export declare function deriveFieldConfigs<T extends BaseFieldConfig>(specifiedFieldsPartial: Partial<T>[], schema: TableSchema | undefined, makeDefaultConfig: (field: TableFieldSchema | undefined) => T): {
    mergedFields: T[];
    minimalFullLengthFields: Partial<T>[];
};
