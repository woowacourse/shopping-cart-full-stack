import { Router } from "express";
import * as ordersController from "./orders.controller.ts";

const router = Router();

router.post("/", ordersController.createOrder);
router.get("/:orderId", ordersController.getOrder);
router.patch("/:orderId", ordersController.updateOrder);
router.get("/:orderId/discount", ordersController.getDiscount);
router.get("/:orderId/coupons", ordersController.getCoupons);

export default router;
