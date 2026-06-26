import useSuspenseQuery from "@/service/queries/useSuspenseQuery";
import { getCart } from "@apis/carts";

export const CART_QUERY_KEY = "cart";

export default function useCartQuery() {
  return useSuspenseQuery({
    key: CART_QUERY_KEY,
    queryFn: getCart,
  });
}
