import { Router } from "express";
import CouponController from "../controller/CouponController";

export const createCouponRouter = (
  couponController: CouponController,
): Router => {
  const couponRouter = Router();

  couponRouter.get("/", couponController.getCoupons);

  return couponRouter;
};
