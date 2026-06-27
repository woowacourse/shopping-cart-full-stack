import express from "express";
import { getCoupons, getOrder, patchOrderCoupon, patchOrderShipping, postOrder } from "./orders.controller";

export const ordersRouter = express.Router();

ordersRouter.post("/", postOrder);
ordersRouter.get("/:orderId/coupons", getCoupons);
ordersRouter.get("/:orderId", getOrder);
ordersRouter.patch("/:orderId/coupons", patchOrderCoupon);
ordersRouter.patch("/:orderId/shipping", patchOrderShipping);
