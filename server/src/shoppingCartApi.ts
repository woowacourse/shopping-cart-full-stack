import { Router } from "express";
import { deleteShoppingCart } from "./service/shoppingCartService.ts";
import {
  getShoppingCart,
  patchShoppingCart,
} from "./service/shoppingCartService.ts";

import { shoppingCart } from "./database/inMemoryDatabase.ts";

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
    if (!shoppingCart.hasProductId(productId)) {
      return res.status(404).send({ message: "유효하지 않은 경로입니다." });
    }

    if (typeof request !== "number" || !Number.isInteger(request)) {
      return res.status(400).send({ message: "유효하지 않은 수량입니다." });
    }

    if (req.body.quantity < 1) {
      return res
        .status(400)
        .send({ message: "상품 수량이 1 이상이어야 합니다." });
    }

    if (req.body.quantity > 99) {
      return res
        .status(400)
        .send({ message: "상품 수량이 99 이하여야 합니다." });
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
    if (!shoppingCart.hasProductId(productId)) {
      return res.status(404).send({ message: "유효하지 않은 경로입니다." });
    }
    deleteShoppingCart(productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/", (_req, res) => {
  res.status(501).send({
    message: "Not Implemented",
  });
});

export default router;
