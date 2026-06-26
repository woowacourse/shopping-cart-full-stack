import { Coupon } from "../../interfaces/coupon.interface.js";
import { PricedItem } from "../../interfaces/checkout.interface.js";
import { CouponContext, validateCouponCondition } from "./validation.js";
import { StrategyContext, sumByPhase } from "./discount-strategy.js";

export interface DiscountContext {
  items: PricedItem[];
  shippingFee: number;
}

export interface BestCombinationContext extends DiscountContext {
  now: Date;
}

export function sumCheckoutAmount(items: PricedItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateCouponDiscount(coupons: Coupon[], context: DiscountContext): number {
  const checkoutAmount = sumCheckoutAmount(context.items);
  const beforeRate: StrategyContext = { ...context, remainingAmount: checkoutAmount };
  const priorDiscount = sumByPhase(coupons, { phase: "prior", context: beforeRate });
  const shippingDiscount = sumByPhase(coupons, { phase: "shipping", context: beforeRate });
  const afterPrior: StrategyContext = { ...context, remainingAmount: Math.max(checkoutAmount - priorDiscount, 0) };
  const rateDiscount = sumByPhase(coupons, { phase: "rate", context: afterPrior });

  const totalDiscount = priorDiscount + shippingDiscount + rateDiscount;
  return Math.min(totalDiscount, checkoutAmount + context.shippingFee);
}

export function findBestCouponCombination(coupons: Coupon[], context: BestCombinationContext): number[] {
  const conditionContext = toConditionContext(context);
  const usableCoupons = coupons.filter((coupon) => validateCouponCondition(coupon, conditionContext));

  const best = buildCombinations(usableCoupons).reduce<BestCombination>(
    (acc, combination) => pickBetterCombination(acc, { combination, context }),
    { couponIds: [], discount: 0 },
  );

  return best.couponIds;
}

interface BestCombination {
  couponIds: number[];
  discount: number;
}

function buildCombinations<T>(values: T[]): T[][] {
  const singles = values.map((value) => [value]);
  const pairs = values.flatMap((value, index) => values.slice(index + 1).map((other) => [value, other]));
  return [[], ...singles, ...pairs];
}

function pickBetterCombination(
  acc: BestCombination,
  candidate: { combination: Coupon[]; context: DiscountContext },
): BestCombination {
  const discount = calculateCouponDiscount(candidate.combination, candidate.context);
  if (discount <= acc.discount) {
    return acc;
  }
  return { couponIds: candidate.combination.map((coupon) => coupon.id), discount };
}

function toConditionContext(context: BestCombinationContext): CouponContext {
  return {
    checkoutAmount: sumCheckoutAmount(context.items),
    items: context.items,
    now: context.now,
  };
}
