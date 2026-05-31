import express from "express";
import cors from "cors";
import ProductController from "./features/product/product.controller.js";
import CartController from "./controllers/cart.controller.js";
import handleProductError from "./features/product/product.middleware.js";
import { globalErrorHandler } from "./errors/error.middleware.js";

export function createApp({
  productController,
  // cartController,
}: {
  productController: ProductController;
  // cartController: CartController;
}) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/products", productController.getProductAll);
  app.get("/products/:productId", productController.getProduct);
  app.post("/products", productController.addProduct);
  app.delete("/products/:productId", productController.removeProduct);

  // app.get("/cart", (req, res) => {
  //   cartController.getAllItems(req, res);
  // });
  // app.patch("/cart/:productId", (req, res) => {
  //   cartController.upqdateQuantitiy(req, res);
  // });
  // app.delete("/cart/:productId", (req, res) => {
  //   cartController.deleteItem(req, res);
  // });

  app.use(handleProductError);
  app.use(globalErrorHandler);

  return app;
}
