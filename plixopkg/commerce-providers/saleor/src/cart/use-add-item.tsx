/*
  Forked from https://github.com/vercel/commerce/tree/main/packages/saleor/src
  Changes:None
*/
import { useCallback } from "react";
import type { MutationHook } from "@plasmicpkgs/commerce";
import { CommerceError } from "@plasmicpkgs/commerce";
import { useAddItem, UseAddItem } from "@plasmicpkgs/commerce";
import useCart from "./use-cart";

import * as mutation from "../utils/mutations";

import { getCheckoutId, checkoutToCart } from "../utils";

import { Mutation, MutationCheckoutLinesAddArgs } from "../schema";
import { AddItemHook } from "../types/cart";

export default useAddItem as UseAddItem<typeof handler>;

export const handler: MutationHook<AddItemHook> = {
  fetchOptions: { query: mutation.CheckoutLineAdd },
  async fetcher({ input: item, options, fetch }) {
    if (
      item.quantity &&
      (!Number.isInteger(item.quantity) || item.quantity! < 1)
    ) {
      throw new CommerceError({
        message: "The item quantity has to be a valid integer greater than 0",
      });
    }

    const { checkoutLinesAdd } = await fetch<
      Mutation,
      MutationCheckoutLinesAddArgs
    >({
      ...options,
      variables: {
        checkoutId: getCheckoutId().checkoutId,
        lineItems: [
          {
            variantId: item.variantId,
            quantity: item.quantity ?? 1,
          },
        ],
      },
    });

    return checkoutToCart(checkoutLinesAdd);
  },
  useHook:
    ({ fetch }) =>
    () => {
      const { mutate } = useCart();

      return useCallback(
        async function addItem(input) {
          const data = await fetch({ input });
          if (data) {
            await mutate(data, false);
          } else {
            await mutate();
          }
          return data;
        },
        [fetch, mutate]
      );
    },
};
