import { getOrder } from "@/apis/orders/[orderId]";
import useSuspenseQuery from "@/queries/useSuspenseQuery";

export const ORDER_QUERY_KEY = "order";

export default function useOrderQuery(orderId: number) {
  return useSuspenseQuery({
    key: [ORDER_QUERY_KEY, orderId],
    queryFn: () => getOrder(orderId),
  });
}
