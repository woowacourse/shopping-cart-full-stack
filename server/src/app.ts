import express from "express";
import Product from "./models/Product.js";
import StorageHandler from "./StorageHandler.js";
import { type StorageHandlerType } from "./StorageHandler.js";
import Cart from "./models/Cart.js";

export function createApp<Storage extends StorageHandlerType>(
  storageHandler: StorageHandler<Storage>,
) {
  const app = express();
  app.use(express.json());

  app.get("/api/products/", (_req, res) => {
    res.send({
      products: [...storageHandler.allItems<Product>("products")].map(
        (product) => product.getProduct(),
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

  app.get("/api/cart/", (_req, res) => {
    const cart = storageHandler.getItem<Cart>("cart", "my-cart") as Cart;
    res.send({ items: cart.getAllItems() });
  });

  app.patch("/api/cart/items/:id/", (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = storageHandler.getItem<Cart>("cart", "my-cart") as Cart;
    cart.updateItem(id, quantity);
    res.status(200).send({ product_id: id, quantity: quantity });
  });

  return app;
}
