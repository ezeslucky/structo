import { extractStructoQueryData as internalExtractQueryData } from "@structoapp/prepass";
import {
  handleStructoPrepassContext,
  handlePrepassStructoComponent,
  handlePrepassStructoRootComponent,
} from "./loader-server";
import type { StructoComponentLoader } from "./loader-shared";
import type { StructoRootProvider } from "./StructoRootProvider";


export async function extractStructoQueryData(
  element: React.ReactElement,
  loader: StructoComponentLoader
): Promise<Record<string, any>> {
  return await internalExtractQueryData(element, (elt) =>
    handleClientComponentRef(elt, loader, element)
  );
}

function handleClientComponentRef(
  elt: React.ReactElement,
  loader: StructoComponentLoader,
  rootElement: React.ReactElement
) {
  try {
    const refId: string = (elt.type as any).$$id;
    // We try to detect the root provider by name, as well as by comparing to
    // the root element.
    if (refId.includes("StructoRootProvider") || elt === rootElement) {
      const props: Parameters<typeof StructoRootProvider>[0] = elt.props as any;
      if (props.prefetchedData) {
        handlePrepassStructoRootComponent({ ...props, loader });
      }
      return;
    } else if (
      refId.includes("StructoComponent") &&
      elt.props?.component != null
    ) {
      return handlePrepassStructoComponent(elt.props);
    } else if (
      refId.includes("StructoPrepassContext") &&
      elt.props?.cache != null
    ) {
      return handleStructoPrepassContext(elt.props);
    }
  } catch (err) {
    console.warn("Error processing client reference: ", err);
  }
  return;
}
