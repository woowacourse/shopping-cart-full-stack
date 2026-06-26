import { RequestHandler } from "express";
import { CouponsService } from "../service/coupons.service";

export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  getCoupons: RequestHandler = (_, res) => {
    const couponList = this.couponsService.getCouponList();

    res.status(200).json({
      status: "success",
      message: "쿠폰 목록을 정상적으로 조회하였습니다.",
      data: { couponList },
    });
  };
}
