import { getDiscount } from "@/apis/orders/[orderId]/discount";
import useSuspenseQuery from "@/queries/useSuspenseQuery";
import type { GetDiscountRequest } from "@/types/order";

export const ORDER_DISCOUNT_QUERY_KEY = "order-discount";

export default function useOrderDiscountQuery(orderId: number, params: GetDiscountRequest) {
  return useSuspenseQuery({
    key: [ORDER_DISCOUNT_QUERY_KEY, orderId, ...(params.couponId ?? [])],
    queryFn: () => getDiscount(orderId, params),
  });
}
