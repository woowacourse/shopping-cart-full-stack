import type { Coupon } from './types';

export function getSelectedCouponCodes(coupons: Coupon[]) {
  return coupons
    .filter(({ isSelected }) => isSelected)
    .map(({ id }) => id);
}
