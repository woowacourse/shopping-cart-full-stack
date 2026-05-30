import { Router } from "express";
import {
  deleteShoppingCart,
  existShoppingCartProductId,
} from "./service/shoppingCartService.ts";
import {
  getShoppingCart,
  patchShoppingCart,
} from "./service/shoppingCartService.ts";
import { NotFoundError, NotImplementedError } from "./error.ts";

const router = Router();

router.get("/", (_req, res, next) => {
  try {
    res.status(200).send(getShoppingCart());
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const productId = req.params.id;
    const request = req.body.quantity;
    if (!existShoppingCartProductId(productId)) {
      throw new NotFoundError({
        code: "INVALID_PATH",
        message: "유효하지 않은 경로입니다.",
        field: "wrong path",
      });
    }

    patchShoppingCart(productId, request);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!existShoppingCartProductId(productId)) {
      throw new NotFoundError({
        code: "INVALID_PATH",
        message: "유효하지 않은 경로입니다.",
        field: "wrong path",
      });
    }
    deleteShoppingCart(productId);
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
