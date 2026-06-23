import { useState } from "react";
import { CouponData, OrderData } from "../../type/types";

export default function useCouponModal(
  orderData: OrderData,
  couponData: CouponData[],
) {
  // 체크박스로 표시중인 쿠폰 ID 목록/ 초기값 = 현재 적용되어있는 쿠폰
  const [selectedIds, setSelectedIds] = useState<number[]>(
    orderData.appliedCoupon,
  );
  // 쿠폰 적용 버튼에 표시할 예상 할인액
  const [expectedDiscount, setExpectedDiscount] = useState<number>(
    orderData.couponDiscountAmount,
  );

  const btgoId = couponData.find((c) => c.couponCode === "BTGO")?.couponId;

  const handleToggle = async (couponId: number) => {
    const nextSelectedIds = selectedIds.includes(couponId)
      ? selectedIds.filter((id) => id !== couponId)
      : [...selectedIds, couponId];

    if (nextSelectedIds.length > 2) return;
    setSelectedIds(nextSelectedIds);

    const key = [...nextSelectedIds].sort((a, b) => a - b).join(",");
    setExpectedDiscount(orderData.couponCombinations[key] ?? 0);
  };

  const isDisabled = (coupon: CouponData): boolean => {
    if (!coupon.isAvailable) return true;
    if (selectedIds.length >= 2 && !selectedIds.includes(coupon.couponId))
      return true;
    if (
      btgoId !== undefined &&
      selectedIds.includes(btgoId) &&
      coupon.couponCode !== "BTGO"
    )
      return true;
    if (
      coupon.couponCode === "BTGO" &&
      selectedIds.length > 0 &&
      btgoId !== undefined &&
      !selectedIds.includes(btgoId)
    )
      return true;
    return false;
  };

  const reset = () => {
    setSelectedIds(orderData.appliedCoupon);
    setExpectedDiscount(orderData.couponDiscountAmount);
  };
  return {
    selectedIds,
    expectedDiscount,
    handleToggle,
    isDisabled,
    reset,
  };
}
