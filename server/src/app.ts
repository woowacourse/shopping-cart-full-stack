import express from "express";
import cors from "cors";
import type ProductController from "./features/product/product.controller.js";
import CartController from "./features/cart/cart.controller.js";
import handleProductError from "./features/product/product.middleware.js";
import { globalErrorHandler } from "./errors/error.middleware.js";
import handleCartError from "./features/cart/cart.middleware.js";

export function createApp({
  productController,
  cartController,
}: {
  productController: ProductController;
  cartController: CartController;
}) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/products", productController.getProductAll);
  app.get("/products/:productId", productController.getProduct);
  app.post("/products", productController.addProduct);
  app.delete("/products/:productId", productController.removeProduct);

  app.get("/cart", cartController.getAllItems);
  app.patch("/cart/:productId", cartController.updateQuantity);
  app.delete("/cart/:productId", cartController.deleteItem);

  app.use(handleProductError);
  app.use(handleCartError);
  app.use(globalErrorHandler);

  return app;
}
