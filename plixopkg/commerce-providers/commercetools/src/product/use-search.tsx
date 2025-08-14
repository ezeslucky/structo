import {
  ClientResponse,
  ProductProjectionPagedQueryResponse,
} from "@commercetools/platform-sdk";
import { useSearch } from "@plasmicpkgs/commerce";
import { getSortVariables, normalizeProduct } from "../utils";

import type {
  SearchProductsHook,
  SWRHook,
  UseSearch,
} from "@plasmicpkgs/commerce";

export type SearchProductsInput = {
  search?: string;
  categoryId?: number;
  brandId?: number;
  sort?: string;
  locale?: string;
  count?: number;
};

const useSearchTyped: UseSearch<typeof handler> = useSearch;
export default useSearchTyped;

export const handler: SWRHook<SearchProductsHook> = {
  fetchOptions: {
    method: "get",
    query: "productProjections",
  },
  async fetcher({ input, options, fetch, provider }) {
    const { search, categoryId, sort, count } = input;
    const response = await fetch<
      ClientResponse<ProductProjectionPagedQueryResponse>
    >({
      ...options,
      variables: {
        expand: ["masterData.current"],
        sort: getSortVariables(sort),
        limit: count,
        ...(search
          ? // eslint-disable-next-line
            { search: { [`text.${provider?.locale!}`]: search } }
          : {}),
        ...(categoryId
          ? { filters: `categories.id: subtree("${categoryId}")` }
          : {}),
      },
    });
    return {
      products: response.body.results.map((product) =>
        normalizeProduct(product, provider!.locale)
      ),
      found: response.body.count > 0,
    };
  },
  useHook:
    ({ useData }) =>
    (input = {}) => {
      return useData({
        input: [
          ["search", input.search],
          ["categoryId", input.categoryId],
          ["brandId", input.brandId],
          ["sort", input.sort],
          ["locale", input.locale],
          ["count", input.count],
        ],
        swrOptions: {
          revalidateOnFocus: false,
          ...input.swrOptions,
        },
      });
    },
};
