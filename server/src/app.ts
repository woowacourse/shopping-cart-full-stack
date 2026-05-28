import express from "express";
import ProductController from "./controllers/productController.js";
import { DBInterface } from "./db/db.js";

export function createApp(db: DBInterface) {
  const productController = new ProductController(db);

  const app = express();
  app.use(express.json());

  app.get("/products", (req, res) => {
    productController.getProductAll(req, res);
  });
  app.get("/products/:productId", (req, res) => {
    productController.getProduct(req, res);
  });
  app.post("/products", (req, res) => {
    productController.addProduct(req, res);
  });
  app.delete("/products/:productId", (req, res) => {
    productController.removeProduct(req, res);
  });

  return app;
}
