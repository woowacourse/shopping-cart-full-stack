import { Router } from "express";
import cartController from "../controller/CartController";

const cartRouter = Router();

cartRouter.get("/", cartController.getCartItems);

cartRouter.post("/", cartController.postCartItem);

cartRouter.delete("/:cartItemId", cartController.deleteCartItem);

// PATCH /cart/:cartItemId
cartRouter.patch("/:cartItemId", cartController.patchCartItem);

export default cartRouter;
