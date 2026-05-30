import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  existProductId,
} from "./service/productService.ts";
import { BadRequestError, NotFoundError } from "./error.ts";

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
    res.status(201).send(createProduct(request));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!existProductId(productId)) {
      throw new NotFoundError({
        code: "INVALID_PATH",
        message: "유효하지 않은 경로입니다.",
        field: "productId",
      });
    }
    deleteProduct(productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
