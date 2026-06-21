import type {Coupon, CouponId} from './types.js';

export const MAX_SELECTED_COUPON_COUNT = 2;

interface GetNextSelectedCouponIdsParams {
  coupon: Coupon;
  selectedCouponIds: CouponId[];
}

export function getNextSelectedCouponIds({coupon, selectedCouponIds}: GetNextSelectedCouponIdsParams) {
  const isSelected = selectedCouponIds.includes(coupon.couponId);

  if (isSelected) {
    return selectedCouponIds.filter((couponId) => couponId !== coupon.couponId);
  }

  if (coupon.disabled) return selectedCouponIds;
  if (selectedCouponIds.length >= MAX_SELECTED_COUPON_COUNT) return selectedCouponIds;

  return [...selectedCouponIds, coupon.couponId];
}

interface GetCouponItemDisabledParams {
  coupon: Coupon;
  selectedCouponIds: CouponId[];
}

export function getCouponItemDisabled({coupon, selectedCouponIds}: GetCouponItemDisabledParams) {
  const isSelected = selectedCouponIds.includes(coupon.couponId);
  const isSelectionFull = selectedCouponIds.length >= MAX_SELECTED_COUPON_COUNT;

  return !isSelected && (coupon.disabled || isSelectionFull);
}
