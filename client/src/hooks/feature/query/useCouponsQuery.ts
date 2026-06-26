import useSuspenseQuery from "@/service/queries/useSuspenseQuery";
import { getCoupons } from "@apis/coupons";

export const COUPONS_QUERY_KEY = "coupons";

export default function useCouponsQuery() {
  return useSuspenseQuery({
    key: COUPONS_QUERY_KEY,
    queryFn: getCoupons,
  });
}
