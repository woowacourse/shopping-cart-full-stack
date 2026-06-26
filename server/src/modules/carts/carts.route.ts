import express from "express";
import { cartsController } from "./carts.module";

export const cartsRouter = express.Router();

cartsRouter.get("/", cartsController.getCarts);
cartsRouter.patch("/:id", cartsController.updateCartQuantity);
cartsRouter.delete("/:id", cartsController.deleteCartProduct);
