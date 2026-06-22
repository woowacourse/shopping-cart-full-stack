import {coupons} from '../repositories/index.js';
import {validateCoupon} from '../domain/coupon/couponPolicy.js';
import {createCouponResponse} from '../domain/coupon/couponResponseMapper.js';
import {calculateOrderAmount, calculateShippingFee} from '../domain/order/orderPolicy.js';
import {calculateBestOrderPricing} from '../domain/order/orderPricingPolicy.js';

import type {Coupon} from '../models/Coupon.js';
import type {Preorder} from '../types/preorder.js';

export const couponService = {
  getCoupons(preorder: Preorder, isRemoteArea: boolean) {
    const applicableCoupons: Coupon[] = [];
    const couponResponses = coupons.findAll().map((coupon) => {
      const validationResult = validateCoupon(coupon, preorder, {isRemoteArea});
      const disabledReason = validationResult.valid ? null : validationResult.reason;

      if (validationResult.valid) {
        applicableCoupons.push(coupon);
      }

      return createCouponResponse(coupon, disabledReason);
    });
    const orderAmount = calculateOrderAmount(preorder.items);
    const shippingFee = calculateShippingFee(orderAmount, isRemoteArea);
    const recommendedCouponIds = calculateBestOrderPricing(
      applicableCoupons,
      preorder.items,
      orderAmount,
      shippingFee
    ).appliedCoupons.map((coupon) => coupon.couponId);

    return {
      coupons: couponResponses,
      recommendedCouponIds,
    };
  },
};
