import { useState } from 'react';
import { applyCoupons, calculateCouponDiscount, getCoupons } from '../apis/couponApi';
import type { CouponInfo } from '../types';

const MAX_SELECTED_COUPON_COUNT = 2;

const useCoupon = (onApplied: () => void) => {
  const [info, setInfo] = useState<CouponInfo>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);

  const load = async () => {
    try {
      const data = await getCoupons();
      setInfo(data);
      setSelectedIds(data.selectedCoupons);
      setDiscountAmount(await calculateCouponDiscount(data.selectedCoupons));
    } catch (error) {
      console.error(error);
      alert('쿠폰 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const toggle = async (couponId: string) => {
    const isSelected = selectedIds.includes(couponId);
    if (!isSelected && selectedIds.length >= MAX_SELECTED_COUPON_COUNT) return;

    const nextSelectedIds = isSelected
      ? selectedIds.filter((id) => id !== couponId)
      : [...selectedIds, couponId];

    setSelectedIds(nextSelectedIds);

    try {
      setDiscountAmount(await calculateCouponDiscount(nextSelectedIds));
    } catch (error) {
      console.error(error);
      alert('쿠폰 할인 금액 계산에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const apply = async (): Promise<boolean> => {
    try {
      await applyCoupons(selectedIds);
      onApplied();
      return true;
    } catch (error) {
      console.error(error);
      alert('쿠폰 적용에 실패했습니다. 다시 시도해 주세요.');
      return false;
    }
  };

  return {
    info,
    selectedIds,
    discountAmount,
    load,
    toggle,
    apply,
  };
};

export default useCoupon;
