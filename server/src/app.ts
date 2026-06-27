import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type ProductController from "./features/product/product.controller.js";
import CartController from "./features/cart/cart.controller.js";
import type CheckoutController from "./features/checkout/checkout.controller.js";
import handleProductError from "./features/product/product.middleware.js";
import { globalErrorHandler } from "./errors/error.middleware.js";
import handleCartError from "./features/cart/cart.middleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createApp({
  productController,
  cartController,
  checkoutController,
}: {
  productController: ProductController;
  cartController: CartController;
  checkoutController: CheckoutController;
}) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/images", express.static(join(__dirname, "../public/images")));

  app.get("/products", productController.getProductAll);
  app.get("/products/:productId", productController.getProduct);
  app.post("/products", productController.addProduct);
  app.delete("/products/:productId", productController.removeProduct);

  app.get("/cart", cartController.getAllItems);
  app.patch("/cart/:productId", cartController.updateQuantity);
  app.delete("/cart/:productId", cartController.deleteItem);

  app.post("/checkout", checkoutController.checkout);

  app.use(handleProductError);
  app.use(handleCartError);
  app.use(globalErrorHandler);

  return app;
}
