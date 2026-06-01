import { Router } from "express";
import ProductController from "../controller/ProductController";

export const createProductRouter = (productController: ProductController): Router => {
  const productRouter = Router();

  productRouter.get("/", productController.getProducts);
  productRouter.post("/", productController.postProducts);
  productRouter.delete("/:productId", productController.deleteProducts);

  return productRouter;
};
