import express from 'express';
import { MY_CART_ID } from '../constanst.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { NotFoundError } from '../errors.js';
import { Storage } from '../storages/Storage.js';

export interface ProductController {
  get: express.RequestHandler;
  add: express.RequestHandler;
  delete: express.RequestHandler;
}

export function createProductController(storage: Storage): ProductController {
  return {
    get: (_req, res, next) => {
      try {
        res.send({
          products: storage
            .allItems<Product>('products')
            .map((product) => product.toObject()),
        });
      } catch (err) {
        next(err);
      }
    },
    add: (req, res, next) => {
      try {
        const { name, price, thumbnail } = req.body;
        const product = new Product(name, price, thumbnail);
        storage.addItemById<Product>('products', product.getId(), product);
        const post = { id: product.toObject().id };

        res.status(201).send(post);
      } catch (err) {
        next(err);
      }
    },
    delete: (req, res, next) => {
      try {
        const id = req.params.id as string;
        const hasItem = storage.hasItemById('products', id);

        if (!hasItem) {
          throw new NotFoundError();
        }

        storage.deleteItemById('products', id);
        const cart = storage.getItemById('cart', MY_CART_ID) as Cart;
        cart.deleteItemByProductId(id);

        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
  };
}
