import { postOrder } from "@/apis/orders";
import useMutation from "@/queries/useMutation";
import type { PostOrderResponse } from "@/types/order";

interface UseOrderCreateMutationOptions {
  onSuccess?: (data: PostOrderResponse) => void;
}

export default function useOrderCreateMutation(options?: UseOrderCreateMutationOptions) {
  return useMutation({
    mutateFn: postOrder,
    onSuccess: options?.onSuccess,
  });
}
