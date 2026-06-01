import { Router } from "express";
import CartController from "../controller/CartController";

export const createCartRouter = (cartController: CartController): Router => {
  const cartRouter = Router();

  cartRouter.get("/", cartController.getCartItems);
  cartRouter.post("/", cartController.postCartItem);
  cartRouter.delete("/:cartItemId", cartController.deleteCartItem);
  cartRouter.patch("/:cartItemId", cartController.patchCartItem);

  return cartRouter;
};
