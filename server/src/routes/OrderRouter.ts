import { Router } from "express";
import OrderController from "../controller/OrderController";

export const createOrderRouter = (orderController: OrderController): Router => {
  const orderRouter = Router();

  orderRouter.post("/", orderController.postOrder);
  orderRouter.get("/:orderId", orderController.getOrder);

  return orderRouter;
};
