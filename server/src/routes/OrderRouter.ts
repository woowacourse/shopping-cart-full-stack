import { Router } from "express";
import OrderController from "../controller/OrderController";

const orderRouter = Router();

// GET /order
orderRouter.get("/:orderId", OrderController.getOrder);

// POST /order
orderRouter.post("/", OrderController.postOrder);

// DELETE /order/:orderId
orderRouter.delete("/:orderId", OrderController.deleteOrder);

export default orderRouter;
