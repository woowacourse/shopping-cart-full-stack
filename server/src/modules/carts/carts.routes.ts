import express from "express";
import { getCarts, updateCartQuantity } from "./carts.controller";

export const cartsRouter = express.Router();

cartsRouter.get("/", getCarts);
cartsRouter.put("/:id", updateCartQuantity);
