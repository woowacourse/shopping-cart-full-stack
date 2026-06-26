import { Request, Response } from "express";
import CouponService from "../service/CouponService";
import { handleError } from "./ErrorHandler";

export default class CouponController {
  #couponService: CouponService;

  constructor(couponService: CouponService) {
    this.#couponService = couponService;
  }

  #runGetCoupons = (_request: Request, response: Response): void => {
    const coupons = this.#couponService.getCoupons();
    response.status(200).json(coupons);
  };

  getCoupons = (request: Request, response: Response): void => {
    try {
      this.#runGetCoupons(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };
}
