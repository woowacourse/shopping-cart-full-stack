import express from "express";
import Product from "./models/Product.js";
import { type Storage } from "./storages/Storage.js";
import { MY_CART_ID } from "./constanst.js";
import {
  productBodyValidateMiddelware,
  cartBodyValidateMiddelware,
} from "./middlewares/BodyValiadateMiddleware.js";
import { NotFoundError, InternalServerError } from "./errors.js";
import Cart from "./models/Cart.js";

export function createApp(storage: Storage) {
  const app = express();
  app.use(express.json());

  app.get("/api/products/", (_req, res, next) => {
    try {
      res.send({
        products: [...storage.allItems<Product>("products")].map((product) =>
          product.getProduct(),
        ),
      });
    } catch (err) {
      next(err);
    }
  });

  app.post(
    "/api/products/",
    productBodyValidateMiddelware,
    (req, res, next) => {
      try {
        const { name, price, thumbnail } = req.body;
        const product = new Product(name, price, thumbnail);
        storage.addItem<Product>("products", product.getId(), product);
        const post = { id: product.getProduct().id };

        res.status(201).send(post);
      } catch (err) {
        next(err);
      }
    },
  );

  app.delete("/api/products/:id/", (req, res, next) => {
    try {
      const { id } = req.params;
      const hasItem = storage.hasItem("products", id);
      if (!hasItem) {
        throw new NotFoundError();
      }
      storage.deleteItem("products", id);
      const cart = storage.getItem("cart", MY_CART_ID) as Cart;
      cart.deleteItem(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/cart/", (_req, res, next) => {
    try {
      const cart = storage.getItem<Cart>("cart", MY_CART_ID) as Cart;
      res.send({ items: cart.getAllItems() });
    } catch (err) {
      next(err);
    }
  });

  app.patch(
    "/api/cart/items/:id/",
    cartBodyValidateMiddelware,
    (req, res, next) => {
      try {
        const { id } = req.params;
        const { quantity } = req.body;
        const cart = storage.getItem<Cart>("cart", MY_CART_ID) as Cart;
        if (!cart.hasItem(id)) {
          throw new NotFoundError();
        }

        cart.updateItem(id, quantity);
        res.status(200).send({ product_id: id, quantity: quantity });
      } catch (err) {
        next(err);
      }
    },
  );

  app.delete("/api/cart/items/:id/", (req, res, next) => {
    try {
      const { id } = req.params;
      const cart = storage.getItem<Cart>("cart", MY_CART_ID) as Cart;
      if (!cart.hasItem(id)) {
        throw new NotFoundError();
      }
      cart.deleteItem(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).send({
          code: err.code,
          message: err.message,
        });
      } else {
        const err = new InternalServerError();
        res.status(err.statusCode).send({
          code: err.code,
          message: err.message,
        });
      }
    },
  );

  return app;
}
