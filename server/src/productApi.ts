import { Router } from "express";
import {
  getAllProducts,
  addProductToList,
  removeProductFromList,
  existsProductId,
} from "./service/productService.ts";
import { BadRequestError, NotFoundError } from "./error.ts";
import { removeItemFromCart } from "./service/shoppingCartService.ts";

const router = Router();

router.get("/", (req, res, next) => {
  try {
    res.status(200).send(getAllProducts());
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    const request = req.body;
    const isDuplicateName = getAllProducts().some((product) => {
      return product.getProduct().name === request.name;
    });

    if (isDuplicateName) {
      throw new BadRequestError({
        code: "INVALID_NAME",
        message: "중복된 상품명입니다.",
        field: "productName",
      });
    }
    addProductToList(request);
    res.status(201).send(getAllProducts());
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!existsProductId(productId)) {
      throw new NotFoundError({
        code: "INVALID_PATH",
        message: "해당 상품을 찾을 수 없습니다.",
        field: "productId",
      });
    }
    removeProductFromList(productId);
    removeItemFromCart(productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
