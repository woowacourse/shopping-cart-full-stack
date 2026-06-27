import { getCart } from "@apis/carts/[id]";
import useSuspenseQuery from "@/queries/useSuspenseQuery";

export const CART_QUERY_KEY = "cart";

const DEFAULT_CART_ID = 1;

export default function useCartQuery() {
  return useSuspenseQuery({
    key: [CART_QUERY_KEY],
    queryFn: () => getCart(DEFAULT_CART_ID),
  });
}
