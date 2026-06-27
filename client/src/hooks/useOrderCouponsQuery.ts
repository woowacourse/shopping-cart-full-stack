import { getCoupons } from "@/apis/orders/[orderId]/coupons";
import useSuspenseQuery from "@/queries/useSuspenseQuery";

export const ORDER_COUPONS_QUERY_KEY = "order-coupons";

export default function useOrderCouponsQuery(orderId: number) {
  return useSuspenseQuery({
    key: [ORDER_COUPONS_QUERY_KEY, orderId],
    queryFn: () => getCoupons(orderId),
  });
}
