import { useState } from "react";
import type { CouponResponse } from "../apis/coupon.api.dto";
import { calculateTotalCouponDiscount } from "../domains/coupon/coupon";
import {
  getSelectedCouponIds,
  saveSelectedCouponIds,
} from "../storage/order.storage";

export function useCouponSelection(
  coupons: CouponResponse[],
  totalPrice: number,
  bestCombination: number[],
) {
  const [selectedCouponIds, setSelectedCouponIds] = useState(() => {
    const persisted = getSelectedCouponIds();

    return persisted.length > 0 ? persisted : bestCombination;
  });

  const toggleCoupon = (couponId: number, isUsable = true) => {
    if (!isUsable) return;

    setSelectedCouponIds((prev) => {
      if (prev.includes(couponId)) {
        return prev.filter((id) => id !== couponId);
      }

      if (prev.length >= 2) {
        return prev;
      }

      return [...prev, couponId];
    });
  };

  const selectedCoupons = coupons.filter((coupon) =>
    selectedCouponIds.includes(coupon.id),
  );

  const totalDiscount = calculateTotalCouponDiscount(
    selectedCoupons,
    totalPrice,
  );

  const completeSelection = () => {
    saveSelectedCouponIds(selectedCouponIds);
  };

  return {
    selectedCouponIds,
    toggleCoupon,
    completeSelection,
    totalDiscount,
  };
}
