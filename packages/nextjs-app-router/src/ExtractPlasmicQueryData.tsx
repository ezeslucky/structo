import { structoPrepassExtract } from "@structoapp/prepass";
import type { HeadMetadata } from "@structoapp/query";
import * as React from "react";


export function ExtractStructoQueryData(props: { children?: React.ReactNode }) {
  const { children } = props;
  if (!("useId" in React) || !("use" in React)) {
    throw new Error(
      `You can only use <ExtractStructoQueryData /> from server components.`
    );
  }
  const scriptId = `structo-prefetch-${(React as any)["" + "useId"]()}`;
  if (typeof window === "undefined") {
    const {
      queryData,
      headMetadata,
    }: { queryData: Record<string, any>; headMetadata: HeadMetadata } = (
      React as any
    )["" + "use"](structoPrepassExtract(<>{children}</>));
    return (
      <>
        <script
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(queryData) }}
          data-structo-prefetch-id={scriptId}
          suppressHydrationWarning={true}
        />
        {headMetadata && (
          <script
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(headMetadata),
            }}
            data-structo-head-metadata-id={scriptId}
            suppressHydrationWarning={true}
          />
        )}
      </>
    );
  } else {
    return null;
  }
}
