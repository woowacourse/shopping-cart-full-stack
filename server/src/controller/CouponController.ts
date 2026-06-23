import { Request, Response } from "express";
import {
  getCouponService,
  getAvailableCouponIds,
} from "../service/CouponService";
import { handleError } from "./ErrorHandler";

export const getCoupons = (request: Request, response: Response): void => {
  try {
    const orderId = Number(request.params.orderId);
    const coupons = getCouponService();
    const availableIds = getAvailableCouponIds(orderId);
    const couponsWithAvailability = coupons.map((coupon) => ({
      ...coupon,
      isAvailable: availableIds.includes(coupon.couponId),
    }));
    response.status(200).json(couponsWithAvailability);
  } catch (error) {
    handleError(response, error);
  }
};
