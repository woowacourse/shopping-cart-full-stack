import express from "express";
import {
  deleteCartProduct,
  getCarts,
  updateCartQuantity,
} from "./carts.controller";

export const cartsRouter = express.Router();

cartsRouter.get("/", getCarts);
cartsRouter.patch("/:id", updateCartQuantity);
cartsRouter.delete("/:id", deleteCartProduct);
