import { getOrder } from "@apis/order";
import useSuspenseQuery from "@/service/queries/useSuspenseQuery";

export const ORDER_QUERY_KEY = "order";

export default function useOrderQuery() {
  return useSuspenseQuery({
    key: ORDER_QUERY_KEY,
    queryFn: getOrder,
  });
}
