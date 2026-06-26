import { useState } from "react";
import { calculateCouponDiscountPrice } from "../api";
import { Coupon } from "../types";

export default function useCouponSelection(
  orderId: string,
  selectedCoupons: string[],
  initialDiscountPrice: number,
) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedCoupons);
  const [discountPrice, setDiscountPrice] = useState<number>(initialDiscountPrice);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onToggle(item: Coupon) {
    const next = localSelected.includes(item.id)
      ? localSelected.filter((id) => id !== item.id)
      : [...localSelected, item.id];
    try {
      const data = await calculateCouponDiscountPrice(orderId, {
        selected_coupons: next,
      });
      setLocalSelected(next);
      setDiscountPrice(data.discount_price);
    } catch (err) {
      if (err instanceof Error) setErrorMessage(err.message);
    }
  }

  return { localSelected, discountPrice, errorMessage, setErrorMessage, onToggle };
}
