import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const createCartRouter = (cartController: CartController) => {
  const cartRouter = Router();

  cartRouter.post("/", cartController.addCartItem);
  cartRouter.get("/", cartController.getCartItems);
  cartRouter.delete("/:id", cartController.deleteCartItem);
  cartRouter.patch("/:id", cartController.updateItemCount);

  return cartRouter;
};

export default createCartRouter;
