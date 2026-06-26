import { createCheckout } from "../apis/checkout/checkout";
import { toCheckoutItems } from "../apis/checkout/checkoutMapper";
import type { CartItem } from "../domain/cart";

interface UseCartSubmitParams {
  refetchCart: () => Promise<CartItem[] | null>;
  getItemSelection: (id: number) => boolean;
}

export function useCartSubmit({ refetchCart, getItemSelection }: UseCartSubmitParams) {
  const submitCart = async (): Promise<number | null> => {
    const latestCartItems = await refetchCart();
    if (!latestCartItems) return null;

    const selectedItems = toCheckoutItems(latestCartItems, getItemSelection);

    if (selectedItems.length === 0) return null;

    return createCheckout(selectedItems);
  };

  return { submitCart };
}
