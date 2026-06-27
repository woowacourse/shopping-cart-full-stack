import type { Coupon } from "../../entites/checkout/model";
import { getCouponRuleText } from "../../entites/checkout/lib";

export const MAX_COUPON_SELECT = 2;

export interface CouponView {
  coupon: Coupon;
  selected: boolean;
  usable: boolean;
  disabled: boolean;
  ruleText: string | null;
}

export const toCouponViews = (coupons: Coupon[], selectedIds: string[]): CouponView[] =>
  coupons.map((coupon) => {
    const selected = selectedIds.includes(coupon.id);
    const usable = coupon.status.type === "USABLE";
    const reachedMax = selectedIds.length >= MAX_COUPON_SELECT;

    return {
      coupon,
      selected,
      usable,
      disabled: !usable || (!selected && reachedMax),
      ruleText: getCouponRuleText(coupon.rule),
    };
  });
