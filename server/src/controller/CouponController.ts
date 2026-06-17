import { Request, Response } from "express";
import {
  getCouponService,
  isBtgoAvailable,
  isFixed5000Available,
  isFreeShippingAvailable,
  isMiracleSaleAvailable,
} from "../service/CouponService";
import { handleError } from "./ErrorHandler";

export const getCoupons = (request: Request, response: Response): void => {
  try {
    const orderId = Number(request.params.orderId);
    const coupons = getCouponService();
    const couponsWithAvailability = coupons.map((coupon) => ({
      ...coupon,
      isAvailable:
        coupon.couponId === 1
          ? isFixed5000Available(orderId)
          : coupon.couponId === 2
            ? isBtgoAvailable(orderId)
            : coupon.couponId === 3
              ? isFreeShippingAvailable(orderId)
              : isMiracleSaleAvailable(),
    }));
    response.status(200).json(couponsWithAvailability);
  } catch (error) {
    handleError(response, error);
  }
};
