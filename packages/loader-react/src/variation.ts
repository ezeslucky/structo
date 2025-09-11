import type {
  ExperimentSlice,
  SegmentSlice,
  Split,
} from "@structoapp/loader-core";
import type { GlobalVariantSpec } from "./StructoRootProvider";

export function getStructoCookieValues() {
  return Object.fromEntries(
    document.cookie
      .split("; ")
      .filter((cookie) => cookie.includes("structo:"))
      .map((cookie) => cookie.split("="))
      .map(([key, value]) => [key.split(":")[1], value])
  );
}

export function updateStructoCookieValue(key: string, value: string) {
  document.cookie = `structo:${key}=${value}`;
}

export const getGlobalVariantsFromSplits = (
  splits: Split[],
  variation: Record<string, string>
) => {
  const globalVariants: GlobalVariantSpec[] = [];

  Object.keys(variation).map((variationKey: string) => {
    const [_type, splitId] = variationKey.split(".");
    const sliceId = variation[variationKey];
    const split = splits.find(
      (s) => s.id === splitId || s.externalId === splitId
    );
    if (split) {
      const slice: ExperimentSlice | SegmentSlice | undefined = (
        split.slices as Array<ExperimentSlice | SegmentSlice>
      ).find((s: any) => s.id === sliceId || s.externalId === sliceId);
      if (slice) {
        slice.contents.map((x) => {
          globalVariants.push({
            name: x.group,
            value: x.variant,
            projectId: x.projectId,
          });
        });
      }
    }
  });

  return globalVariants;
};

export const mergeGlobalVariantsSpec = (
  target: GlobalVariantSpec[],
  from: GlobalVariantSpec[]
) => {
  let result = [...target];
  const existingGlobalVariants = new Set(
    target.map((t) => `${t.name}-${t.projectId ?? ""}`)
  );
  const newGlobals = from.filter(
    (t) => !existingGlobalVariants.has(`${t.name}-${t.projectId ?? ""}`)
  );

  if (newGlobals.length > 0) {
    result = [...result, ...newGlobals];
  }

  return result;
};
