import { Coupon, COUPON_CATEGORY, CouponCategory } from "../../interfaces/coupon.interface.js";
import { PricedItem } from "../../interfaces/checkout.interface.js";
import { BTGO_MIN_QUANTITY } from "./validation.js";
import type { DiscountContext } from "./discount.js";

export type DiscountPhase = "prior" | "rate" | "shipping";

export interface StrategyContext extends DiscountContext {
  remainingAmount: number;
}

interface CouponStrategy {
  phase: DiscountPhase;
  discount: (coupon: Coupon, context: StrategyContext) => number;
}

const COUPON_STRATEGIES: Record<CouponCategory, CouponStrategy> = {
  [COUPON_CATEGORY.FIXED]: { phase: "prior", discount: (coupon) => coupon.amount ?? 0 },
  [COUPON_CATEGORY.BTGO]: { phase: "prior", discount: (_coupon, context) => btgoDiscount(context.items) },
  [COUPON_CATEGORY.FREESHIPPING]: { phase: "shipping", discount: (_coupon, context) => context.shippingFee },
  [COUPON_CATEGORY.RATE]: {
    phase: "rate",
    discount: (coupon, context) => Math.floor((context.remainingAmount * (coupon.rate ?? 0)) / 100),
  },
};

export function sumByPhase(coupons: Coupon[], options: { phase: DiscountPhase; context: StrategyContext }): number {
  const { phase, context } = options;
  return coupons
    .filter((coupon) => COUPON_STRATEGIES[coupon.category].phase === phase)
    .reduce((sum, coupon) => sum + COUPON_STRATEGIES[coupon.category].discount(coupon, context), 0);
}

function btgoDiscount(items: PricedItem[]): number {
  return items.reduce((sum, item) => sum + Math.floor(item.quantity / BTGO_MIN_QUANTITY) * item.price, 0);
}
