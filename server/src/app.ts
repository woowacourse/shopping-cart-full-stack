import express from "express";
import Product from "./models/Product.js";
import StorageHandler from "./StorageHandler.js";

export function createApp<T>(storageHandler: StorageHandler<T>) {
  const app = express();
  app.use(express.json());

  app.get("/api/products/", (_req, res) => {
    res.send({
      products: [...storageHandler.allItems("products")].map((product) =>
        product.getProduct(),
      ),
    });
  });

  app.post("/api/products/", (req, res) => {
    const { name, price, thumbnail } = req.body;
    const product = new Product(name, price, thumbnail);
    storageHandler.addItem<Product>("products", product.getId(), product);
    const post = { id: product.getProduct().id };

    res.status(201).send(post);
  });

  app.delete("/api/products/:id/", (req, res) => {
    const { id } = req.params;
    storageHandler.deleteItem("products", id);
    res.status(204).send();
  });

  return app;
}
