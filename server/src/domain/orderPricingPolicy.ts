import {
  calculateProductCouponDiscount,
  getProductCouponPriority,
  isProductDiscountCoupon,
  isShippingDiscountCoupon,
} from './couponPolicy.js';

import type {Coupon} from '../types/coupon.js';
import type {AppliedCoupon, OrderPrice} from '../types/order.js';
import type {PreorderItem} from '../types/preorder.js';

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
  let productDiscountAmount = 0;
  const appliedCoupons: AppliedCoupon[] = [];

  const productCoupons = coupons
    .filter(isProductDiscountCoupon)
    .sort((a, b) => getProductCouponPriority(a) - getProductCouponPriority(b));

  productCoupons.forEach((coupon) => {
    const discountAmount = calculateProductCouponDiscount(coupon, items, remainingProductAmount);

    if (discountAmount <= 0) {
      return;
    }

    productDiscountAmount += discountAmount;
    remainingProductAmount -= discountAmount;
    appliedCoupons.push(toAppliedCoupon(coupon, discountAmount));
  });

  return {
    appliedCoupons,
    productDiscountAmount,
  };
};

const calculateShippingDiscount = (coupons: Coupon[], shippingFee: number) => {
  let shippingDiscountAmount = 0;
  const appliedCoupons: AppliedCoupon[] = [];

  coupons.forEach((coupon) => {
    if (!isShippingDiscountCoupon(coupon)) {
      return;
    }

    const discountAmount = coupon.benefit.params.includesRemoteAreaFee ? shippingFee : 0;

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

  const price: OrderPrice = {
    orderAmount,
    productDiscountAmount,
    shippingDiscountAmount,
    totalDiscountAmount,
    shippingFee: shippingFee - shippingDiscountAmount,
    totalPaymentAmount: orderAmount + shippingFee - totalDiscountAmount,
  };

  return {
    price,
    appliedCoupons: [...productDiscount.appliedCoupons, ...shippingDiscount.appliedCoupons],
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
    .sort((a, b) => a.price.totalPaymentAmount - b.price.totalPaymentAmount)[0];
};
