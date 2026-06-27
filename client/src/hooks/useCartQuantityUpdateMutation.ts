import { updateCartItemQuantity } from "@/apis/carts/[id]/products/[id]";
import { queryStore } from "@/queries/instance";
import useMutation from "@/queries/useMutation";
import { CART_QUERY_KEY } from "./useCartQuery";
import type { Cart } from "@/types/cartProduct";

const DEFAULT_CART_ID = 1;

export default function useCartQuantityUpdateMutation() {
  return useMutation({
    mutateFn: async (productId: number, quantity: number) => {
      const previousCart = queryStore.getSnapshot([CART_QUERY_KEY]) as Cart[] | undefined;

      if (previousCart) {
        const newCart = previousCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
        queryStore.setQuery([CART_QUERY_KEY], newCart);
      }

      try {
        return await updateCartItemQuantity(DEFAULT_CART_ID, productId, quantity);
      } catch (error) {
        if (previousCart) {
          queryStore.setQuery([CART_QUERY_KEY], previousCart);
        }
        throw error;
      }
    },
  });
}
