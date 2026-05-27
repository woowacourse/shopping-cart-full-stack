import { Router } from "express";
import productController from "../controller/ProductController.ts"

const productRouter = Router();

// GET /products
productRouter.get("/", productController.getProducts);

// POST /products
productRouter.post("/", productController.postProducts);

// DELETE /products/:productId
productRouter.delete("/:productId", productController.deleteProducts);

export default productRouter;
