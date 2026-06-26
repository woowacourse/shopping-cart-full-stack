import { queryStore } from "@/service/queries/instance";
import useMutation from "@/service/queries/useMutation";
import { patchCartQuantity } from "@apis/carts/[id]";
import { CART_QUERY_KEY } from "@hooks/feature/query/useCartQuery";

export default function useCartQuantityUpdateMutation() {
  return useMutation({
    mutateFn: patchCartQuantity,
    onSuccess: () => {
      queryStore.invalidate(CART_QUERY_KEY);
    },
  });
}
