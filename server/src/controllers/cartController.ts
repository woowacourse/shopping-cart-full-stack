import express from 'express';
import { DEFAULT_USER_ID } from '../constants/user.js';
import { NotFoundError } from '../errors.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { Storage } from '../storages/Storage.js';

export interface CartController {
  get: express.RequestHandler;
  update: express.RequestHandler<{ productId: string }>;
  delete: express.RequestHandler<{ productId: string }>;
}

export function createCartController(storage: Storage): CartController {
  return {
    get: (_req, res, next) => {
      try {
        const cart = storage.getItemById<Cart>('cart', DEFAULT_USER_ID) as Cart;
        const cartItems = cart.getAllItems();

        const items = cartItems.map(({ product_id, quantity }) => {
          const product = storage.getItemById<Product>('products', product_id);

          if (!product) {
            throw new NotFoundError();
          }

          return {
            product: product.toObject(),
            quantity,
          };
        });

        res.send({ items });
      } catch (err) {
        next(err);
      }
    },
    update: (req, res, next) => {
      try {
        const id = req.params.productId;
        const { quantity } = req.body;
        const cart = storage.getItemById<Cart>('cart', DEFAULT_USER_ID) as Cart;

        if (!cart.hasItemByProductId(id)) {
          throw new NotFoundError();
        }

        cart.updateItemByProductId(id, quantity);
        storage.updateItemById<Cart>('cart', DEFAULT_USER_ID, cart);

        res.status(200).send({ product_id: id, quantity: quantity });
      } catch (err) {
        next(err);
      }
    },
    delete: (req, res, next) => {
      try {
        const id = req.params.productId;
        const cart = storage.getItemById<Cart>('cart', DEFAULT_USER_ID) as Cart;

        if (!cart.hasItemByProductId(id)) {
          throw new NotFoundError();
        }

        cart.deleteItemByProductId(id);
        storage.updateItemById<Cart>('cart', DEFAULT_USER_ID, cart);

        res.status(204).send();
      } catch (err) {
        next(err);
      }
    },
  };
}
