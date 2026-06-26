import { queryStore } from "@/service/queries/instance";
import useMutation from "@/service/queries/useMutation";
import { postOrder } from "@apis/order";
import { ORDER_QUERY_KEY } from "@hooks/feature/query/useOrderQuery";

export default function useOrderCreateMutation() {
  return useMutation({
    mutateFn: postOrder,
    onSuccess: () => {
      queryStore.invalidate(ORDER_QUERY_KEY);
    },
  });
}
