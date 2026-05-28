import express from "express";
import { MY_CART_ID } from "./constanst.js";
import Cart from "./models/Cart.js";
import { Storage } from "./storages/Storage.js";
import { NotFoundError } from "./errors.js";
import Product from "./models/Product.js";

export interface ProductController {
  get: express.RequestHandler;
  add: express.RequestHandler;
  delete: express.RequestHandler;
}

export interface CartController {
  get: express.RequestHandler;
  update: express.RequestHandler<{ id: string }>;
  delete: express.RequestHandler<{ id: string }>;
}

export function createProductController(storage: Storage): ProductController {
  return {
    get: (_req, res, next) => {
      try {
        res.send({
          products: [...storage.allItems<Product>("products")].map((product) =>
            product.getProduct(),
          ),
        });
      } catch (err) {
        next(err);
      }
    },
    add: (req, res, next) => {
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
    delete: (req, res, next) => {
      try {
        const id = req.params.id as string;
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
    },
  };
}

export function createCartController(storage: Storage): CartController {
  return {
    get: (_req, res, next) => {
      try {
        const cart = storage.getItem<Cart>("cart", MY_CART_ID) as Cart;
        res.send({ items: cart.getAllItems() });
      } catch (err) {
        next(err);
      }
    },
    update: (req, res, next) => {
      try {
        const id = req.params.id;
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
    delete: (req, res, next) => {
      try {
        const id = req.params.id;
        const cart = storage.getItem<Cart>("cart", MY_CART_ID) as Cart;
        if (!cart.hasItem(id)) {
          throw new NotFoundError();
        }
        cart.deleteItem(id);
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
  };
}
