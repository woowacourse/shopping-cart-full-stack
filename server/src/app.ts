import express from "express";
import Product from "./models/Product.js";
import { type Storage } from "./storages/Storage.js";
import { MY_CART_ID } from "./constanst.js";
import {
  productBodyValidateMiddelware,
  cartBodyValidateMiddelware,
} from "./middlewares/BodyValiadateMiddleware.js";
import Cart from "./models/Cart.js";

export function createApp(storage: Storage) {
  const app = express();
  app.use(express.json());

  app.get("/api/products/", (_req, res) => {
    res.send({
      products: [...storage.allItems<Product>("products")].map((product) =>
        product.getProduct(),
      ),
    });
  });

  app.post("/api/products/", productBodyValidateMiddelware, (req, res) => {
    const { name, price, thumbnail } = req.body;
    const product = new Product(name, price, thumbnail);
    storage.addItem<Product>("products", product.getId(), product);
    const post = { id: product.getProduct().id };

    res.status(201).send(post);
  });

  app.delete("/api/products/:id/", (req, res) => {
    const { id } = req.params;
    const hasItem = storage.hasItem("products", id);
    if (!hasItem)
      res.status(404).send({
        code: "RESOURCE_NOT_FOUND",
        message: "요청한 리소스를 찾을 수 없습니다.",
      });
    storage.deleteItem("products", id);
    const cart = storage.getItem("cart", MY_CART_ID) as Cart;
    cart.deleteItem(id);
    res.status(204).send();
  });

  app.get("/api/cart/", (_req, res) => {
    const cart = storage.getItem<Cart>("cart", MY_CART_ID) as Cart;
    res.send({ items: cart.getAllItems() });
  });

  app.patch("/api/cart/items/:id/", cartBodyValidateMiddelware, (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = storage.getItem<Cart>("cart", MY_CART_ID) as Cart;
    cart.updateItem(id, quantity);
    res.status(200).send({ product_id: id, quantity: quantity });
  });

  app.delete("/api/cart/items/:id/", (req, res) => {
    const { id } = req.params;
    const cart = storage.getItem<Cart>("cart", MY_CART_ID) as Cart;
    cart.deleteItem(id);
    res.status(204).send();
  });

  return app;
}
