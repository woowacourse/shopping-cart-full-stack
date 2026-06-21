import {useEffect, useState} from 'react';

import type {AsyncStatus} from '../../../../design-system/feedback/AsyncStateView.js';
import type {CouponId} from '../../../coupon/domain/types.js';

interface UseCouponAutoSelectionParams {
  couponsStatus: AsyncStatus;
  isCouponModalOpen: boolean;
  recommendedCouponIds: CouponId[];
  selectedCouponIds: CouponId[];
  onSelectCoupons: (couponIds: CouponId[]) => void;
}

export function useCouponAutoSelection({
  couponsStatus,
  isCouponModalOpen,
  onSelectCoupons,
  recommendedCouponIds,
  selectedCouponIds,
}: UseCouponAutoSelectionParams) {
  const [hasAutoSelectedCoupons, setHasAutoSelectedCoupons] = useState(false);
  const shouldAutoSelectCoupons =
    isCouponModalOpen &&
    !hasAutoSelectedCoupons &&
    couponsStatus === 'success' &&
    selectedCouponIds.length === 0;

  useEffect(() => {
    if (!shouldAutoSelectCoupons) return;

    onSelectCoupons(recommendedCouponIds);
    setHasAutoSelectedCoupons(true);
  }, [onSelectCoupons, recommendedCouponIds, shouldAutoSelectCoupons]);
}
