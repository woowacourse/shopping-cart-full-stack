import { Router } from "express";
import OrderController from "../controller/OrderController";

const orderRouter = Router();

// GET /order/:orderId/coupon/calculate?couponIds=1,2
orderRouter.get(
  "/:orderId/coupon/calculate",
  OrderController.getCouponCalculate,
);

// GET /order
orderRouter.get("/:orderId", OrderController.getOrder);

// POST /order
orderRouter.post("/", OrderController.postOrder);

// PATCH /order
orderRouter.patch("/:orderId/address", OrderController.patchOrder);

//PATCH/order/:orderId/coupon
orderRouter.patch("/:orderId/coupon", OrderController.patchCoupon);

// DELETE /order/:orderId
orderRouter.delete("/:orderId", OrderController.deleteOrder);

// POST /order/:orderId/payment
orderRouter.post("/:orderId/payment", OrderController.postPayment);

export default orderRouter;
