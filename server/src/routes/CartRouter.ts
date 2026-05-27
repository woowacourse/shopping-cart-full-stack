import { Router } from "express";

const cartRouter = Router();

// GET /cart
cartRouter.get("/", cartController.getCartItems());

// POST /cart
cartRouter.post("/", cartController.postCartItem());

// DELETE /cart/:cartItemId
cartRouter.delete("/:cartItemId", cartController.deleteCartItem());

// PATCH /cart/:cartItemId
cartRouter.patch("/:cartItemId", cartController.patchCartItem());

export default cartRouter;