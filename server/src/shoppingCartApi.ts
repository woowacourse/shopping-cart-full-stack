import { Router } from "express";
import {
  removeItemFromCart,
  existsInCart,
} from "./service/shoppingCartService.ts";
import {
  getItemsFromCart,
  updateQuantityOfItem,
} from "./service/shoppingCartService.ts";
import { NotFoundError, NotImplementedError } from "./error.ts";

const router = Router();

router.get("/", (_req, res, next) => {
  try {
    res.status(200).send(getItemsFromCart());
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const productId = req.params.id;
    const request = req.body.quantity;
    if (!existsInCart(productId)) {
      throw new NotFoundError({
        code: "INVALID_PATH",
        message: "유효하지 않은 경로입니다.",
        field: "wrong path",
      });
    }

    updateQuantityOfItem(productId, request);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!existsInCart(productId)) {
      throw new NotFoundError({
        code: "INVALID_PATH",
        message: "유효하지 않은 경로입니다.",
        field: "wrong path",
      });
    }
    removeItemFromCart(productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/", (_req, res) => {
  throw new NotImplementedError({
    code: "NOT_IMPLEMENTED",
    message: "Not Implemented",
    field: "create shopping cart items",
  });
});

export default router;
