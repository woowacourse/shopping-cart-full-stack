import {
  calculateProductCoupon,
  calculateShippingCouponDiscount,
} from '../coupon/couponPolicy.js';

import type {Coupon, ProductDiscountCoupon} from '../../models/Coupon.js';
import type {AppliedCoupon, BenefitItem, OrderPrice} from '../../types/order.js';
import type {PreorderItem} from '../../types/preorder.js';

const toAppliedCoupon = (coupon: Coupon, discountAmount: number): AppliedCoupon => {
  return {
    couponId: coupon.id,
    code: coupon.code,
    name: coupon.name,
    discountAmount,
  };
};

const calculateProductDiscount = (coupons: Coupon[], items: PreorderItem[], orderAmount: number) => {
  let remainingProductAmount = orderAmount;
  let benefitOrderAmount = 0;
  let productDiscountAmount = 0;
  const appliedCoupons: AppliedCoupon[] = [];
  const benefitItems: BenefitItem[] = [];

  const productCoupons = coupons
    .filter((coupon): coupon is ProductDiscountCoupon => coupon.isProductDiscount())
    .sort((a, b) => a.getProductDiscountPriority() - b.getProductDiscountPriority());

  productCoupons.forEach((coupon) => {
    const {benefitItem, discountAmount} = calculateProductCoupon(coupon, items, remainingProductAmount);

    if (discountAmount <= 0) {
      return;
    }

    productDiscountAmount += discountAmount;

    if (benefitItem) {
      benefitOrderAmount += discountAmount;
      remainingProductAmount += discountAmount;
      benefitItems.push(benefitItem);
    }

    remainingProductAmount -= discountAmount;
    appliedCoupons.push(toAppliedCoupon(coupon, discountAmount));
  });

  return {
    appliedCoupons,
    benefitOrderAmount,
    benefitItems,
    productDiscountAmount,
  };
};

const calculateShippingDiscount = (coupons: Coupon[], shippingFee: number) => {
  let shippingDiscountAmount = 0;
  const appliedCoupons: AppliedCoupon[] = [];

  coupons.forEach((coupon) => {
    if (!coupon.isShippingDiscount()) {
      return;
    }

    const discountAmount = calculateShippingCouponDiscount(shippingFee);

    if (discountAmount <= 0) {
      return;
    }

    shippingDiscountAmount += discountAmount;
    appliedCoupons.push(toAppliedCoupon(coupon, discountAmount));
  });

  return {
    appliedCoupons,
    shippingDiscountAmount: Math.min(shippingDiscountAmount, shippingFee),
  };
};

const getCouponCombinations = (coupons: Coupon[]) => {
  const combinations: Coupon[][] = [[]];

  coupons.forEach((coupon, index) => {
    combinations.push([coupon]);

    coupons.slice(index + 1).forEach((nextCoupon) => {
      combinations.push([coupon, nextCoupon]);
    });
  });

  return combinations;
};

export const calculateOrderPricing = (
  applicableCoupons: Coupon[],
  items: PreorderItem[],
  orderAmount: number,
  shippingFee: number
) => {
  const productDiscount = calculateProductDiscount(applicableCoupons, items, orderAmount);
  const shippingDiscount = calculateShippingDiscount(applicableCoupons, shippingFee);
  const shippingDiscountAmount = shippingDiscount.shippingDiscountAmount;
  const productDiscountAmount = productDiscount.productDiscountAmount;
  const totalDiscountAmount = productDiscountAmount + shippingDiscountAmount;
  const displayedOrderAmount = orderAmount + productDiscount.benefitOrderAmount;

  const price: OrderPrice = {
    orderAmount: displayedOrderAmount,
    productDiscountAmount,
    shippingDiscountAmount,
    totalDiscountAmount,
    shippingFee: shippingFee - shippingDiscountAmount,
    totalPaymentAmount: displayedOrderAmount + shippingFee - totalDiscountAmount,
  };

  return {
    price,
    appliedCoupons: [...productDiscount.appliedCoupons, ...shippingDiscount.appliedCoupons],
    benefitItems: productDiscount.benefitItems,
  };
};

export const calculateBestOrderPricing = (
  applicableCoupons: Coupon[],
  items: PreorderItem[],
  orderAmount: number,
  shippingFee: number
) => {
  return getCouponCombinations(applicableCoupons)
    .map((couponCombination) => calculateOrderPricing(couponCombination, items, orderAmount, shippingFee))
    .sort((a, b) => {
      if (a.price.totalPaymentAmount !== b.price.totalPaymentAmount) {
        return a.price.totalPaymentAmount - b.price.totalPaymentAmount;
      }

      return b.price.totalDiscountAmount - a.price.totalDiscountAmount;
    })[0];
};
