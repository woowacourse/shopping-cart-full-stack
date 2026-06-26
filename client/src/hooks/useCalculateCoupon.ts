import { useState } from "react";
import { getCouponDiscount } from "../apis/checkout/checkout";
import { discountPreviewQueryKey } from "../constants/queryKeys";
import { useCouponPolicy } from "./useCouponPolicy";
import { useMyQuery } from "../lib/myQuery/useMyQuery";

export function useCalculateCoupon(checkoutId: number, initialCouponIds: number[] = [], initialDiscount: number = 0) {
  const { maxCouponCount } = useCouponPolicy();
  const [selectedCouponIds, setSelectedCouponIds] = useState<number[]>(initialCouponIds);

  const isDirty =
    initialCouponIds.length !== selectedCouponIds.length ||
    selectedCouponIds.some((id) => !initialCouponIds.includes(id));

  const queryKey = discountPreviewQueryKey(checkoutId, selectedCouponIds);
  const { data, isLoading } = useMyQuery<number>(queryKey, () => getCouponDiscount(checkoutId, selectedCouponIds), {
    initialData: isDirty ? undefined : initialDiscount,
  });

  const toggleCouponCheckBox = (id: number, checked: boolean) => {
    setSelectedCouponIds((prev) => {
      if (checked) {
        if (prev.includes(id) || prev.length >= maxCouponCount) return prev;
        return [...prev, id];
      }
      if (!prev.includes(id)) return prev;
      return prev.filter((couponId) => couponId !== id);
    });
  };

  return {
    isPending: isLoading,
    isDirty,
    selectedCouponIds,
    toggleCouponCheckBox,
    estimatedCouponDiscount: data ?? initialDiscount,
  };
}
