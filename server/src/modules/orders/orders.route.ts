import express from "express";
import { ordersController } from "./orders.module";

export const ordersRouter = express.Router();

ordersRouter.get("/", ordersController.getOrder);
ordersRouter.post("/", ordersController.postOrders);
ordersRouter.patch("/", ordersController.updateOrder);
ordersRouter.post("/discount-price", ordersController.discountPrice);
