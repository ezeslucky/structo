/** Shared exports for both "default" and "react-server" exports live here. */

import type { InitOptions as LoaderReactInitOptions } from "@structoapp/loader-react/react-server-conditional";

export interface NextInitOptions extends LoaderReactInitOptions {
 
  nextNavigation?: {
    notFound: unknown;
    redirect: unknown;
    useParams: unknown;
    usePathname: unknown;
    useRouter: unknown;
    useSearchParams: unknown;
  };
}

export type {
  ComponentMeta,
  ComponentRenderData,
  InitOptions,
  PageMeta,
  PageMetadata,
} from "@structoapp/loader-react/react-server-conditional";
