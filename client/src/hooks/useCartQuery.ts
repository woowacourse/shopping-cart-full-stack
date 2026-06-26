import { getCart } from "../apis/cart/cart";
import { toCartItem } from "../apis/cart/cartMapper";
import { useMyQuery } from "../lib/myQuery/useMyQuery";
import { CART_QUERY_KEY } from "../constants/queryKeys";
import type { CartItem } from "../domain/cart";

export function useCartQuery() {
  const { data, isLoading, hasError, error, refetch } = useMyQuery(CART_QUERY_KEY, getCart);

  const refetchCartItems = async (): Promise<CartItem[] | null> => {
    const responses = await refetch();
    return responses ? responses.map(toCartItem) : null;
  };

  return {
    cartItems: (data ?? []).map(toCartItem),
    isLoading,
    hasError,
    error,
    refetch: refetchCartItems,
  };
}
