import { Router } from "express";

import * as cartsController from "./carts.controller.ts";

const cartsRouter = Router();

cartsRouter.get("/:cartId", cartsController.getCartById);
cartsRouter.patch(
  "/:cartId/products/:productId",
  cartsController.updateCartProduct,
);
cartsRouter.delete(
  "/:cartId/products/:productId",
  cartsController.deleteCartProduct,
);

export default cartsRouter;
