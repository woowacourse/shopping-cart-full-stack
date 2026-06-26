import { queryStore } from "@/service/queries/instance";
import useMutation from "@/service/queries/useMutation";
import { patchOrder } from "@apis/order";
import { ORDER_QUERY_KEY } from "@hooks/feature/query/useOrderQuery";

export default function useOrderUpdateMutation() {
  return useMutation({
    mutateFn: patchOrder,
    onSuccess: () => {
      queryStore.invalidate(ORDER_QUERY_KEY);
    },
  });
}
