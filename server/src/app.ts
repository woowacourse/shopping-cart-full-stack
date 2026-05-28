import express from "express";
import ProductController from "./controllers/productController.js";

export function createApp(db: unknown) {
  const productController = new ProductController(db);

  const app = express();
  app.use(express.json());

  app.get("/products", (req, res) => {
    productController.getProductAll(req, res);
  });
  app.get("/products/:id", (req, res) => {
    productController.getProduct(req, res);
  });
  app.post("/products/:id", (req, res) => {
    productController.addProduct(req, res);
  });
  app.delete("/products/:id", (req, res) => {
    productController.removeProduct(req, res);
  });

  app.use(errorMiddleware);
  return app;
}
