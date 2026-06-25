import { Router } from "express";
import { getCoupons } from "../controller/CouponController";

const couponRouter = Router();

couponRouter.get("/:orderId", getCoupons);

export default couponRouter;
