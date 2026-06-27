import { Request, Response } from "express";
import { getCoupons as fetchCoupons } from "../services/coupon.service.js";
import { COMMON_ERROR_RESPONSE } from "../constants/error.js";
export async function getCoupons(request: Request, response: Response): Promise<void> {
  const { selectedCartItemIds, isRemoteArea } = request.body;

  if (!Array.isArray(selectedCartItemIds) || typeof isRemoteArea !== "boolean")
    throw new Error(COMMON_ERROR_RESPONSE.INVALID_REQUEST_BODY.code);

  const couponList = await fetchCoupons(selectedCartItemIds, isRemoteArea);
  response.status(200).json(couponList);
}
