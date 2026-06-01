import { Router } from "express";
import CartController from "./cart.controller.js";

const createCartRouter = (cartController: CartController) => {
  const cartRouter = Router();

  cartRouter.post("/", cartController.addCart);
  cartRouter.post("/:cartId/items", cartController.addCartItem);
  cartRouter.get("/:cartId/items", cartController.getCartItems);
  cartRouter.delete("/:cartId/items/:productId", cartController.deleteCartItem);
  cartRouter.patch("/:cartId/items/:productId", cartController.updateItemCount);

  return cartRouter;
};

export default createCartRouter;
