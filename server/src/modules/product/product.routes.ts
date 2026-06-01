import { Router } from "express";
import ProductController from "./product.controller.js";

const createProductRouter = (productController: ProductController) => {
  const productRouter = Router();

  productRouter.post("/", productController.addProduct);
  productRouter.delete("/:id", productController.deleteProduct);
  productRouter.get("/", productController.getProducts);

  return productRouter;
};

export default createProductRouter;
