import {coupons} from '../db.js';
import {preorderService} from './PreorderService.js';

export const couponService = {
  getCoupons(preorderId: string) {
    preorderService.getPreorder(preorderId);

    return coupons.map((coupon) => ({
      couponId: coupon.id,
      code: coupon.code,
      name: coupon.name,
      expirationDate: coupon.expirationDate.toISOString(),
      condition: coupon.condition,
      benefit: coupon.benefit,
      disabled: false,
      disabledReason: null,
    }));
  },
};
