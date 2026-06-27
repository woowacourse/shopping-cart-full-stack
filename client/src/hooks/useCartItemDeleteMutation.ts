import { deleteCartItem } from "@/apis/carts/[id]/products/[id]";
import { queryStore } from "@/queries/instance";
import useMutation from "@/queries/useMutation";
import { CART_QUERY_KEY } from "./useCartQuery";

const DEFAULT_CART_ID = 1;

export default function useCartItemDeleteMutation() {
  return useMutation({
    mutateFn: (productId: number) =>
      deleteCartItem(DEFAULT_CART_ID, productId),
    onSuccess: () => {
      queryStore.invalidate([CART_QUERY_KEY]);
    },
  });
}
