import { Router } from "express";

const productRouter = Router();

// GET /products
productRouter.get("/", productController.getProducts());

// POST /products
productRouter.post("/", productController.postProducts());

// DELETE /products/:productId
productRouter.delete("/:productId", productController.deleteProducts());

export default productRouter;
