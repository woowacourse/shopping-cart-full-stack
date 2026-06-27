import { useSuspenseQuery } from "../../../shared/queries";
import { getCoupons } from "../api/coupon";
import type { Coupon } from "../types";

export const COUPONS_QUERY_KEY = "coupons";

export function useCouponsQuery(): Coupon[] {
  return useSuspenseQuery<Coupon[]>({
    key: COUPONS_QUERY_KEY,
    queryFn: getCoupons,
  });
}
