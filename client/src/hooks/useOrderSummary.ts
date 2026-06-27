import { useMemo } from "react";
import type { CartItemType } from "../types/cart";
import { calcOrderSummary } from "../utils/orderSummaryUtils";

export function useOrderSummary(
  cartItems: CartItemType[],
  isSelected: { [id: number]: boolean },
) {
  const summary = useMemo(
    () => calcOrderSummary(cartItems, isSelected),
    [cartItems, isSelected],
  );

  return summary;
}
