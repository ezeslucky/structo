import {
  extractStructoQueryData as internalExtractQueryData,
  structoPrepass as internalStructoPrepass,
} from "@structoapp/prepass";


export function extractStructoQueryData(
  element: React.ReactElement
): Promise<Record<string, any>> {
  return internalExtractQueryData(element);
}

/**
 * @deprecated Maintained for backwards compatibility
 */
export function structoPrepass(element: React.ReactElement): Promise<void> {
  return internalStructoPrepass(element);
}
