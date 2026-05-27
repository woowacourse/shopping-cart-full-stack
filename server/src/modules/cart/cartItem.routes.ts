import { Router } from 'express';
import { cartItemService } from './cartItem.service.js';

export const cartItemRouter = Router();

cartItemRouter.get('/users/:userId/cart/items', (_req, res, next) => {
  try {
    const product = cartItemService.getCartItems();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});
cartItemRouter.post('/users/:userId/cart/items', (req, res, next) => {
  try {
    const cartItem = cartItemService.addCartItem(req.body.productId);
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
});

cartItemRouter.delete(
  '/users/:userId/cart/items/:cartItemId',
  (req, res, next) => {
    try {
      cartItemService.deleteCartItem(req.params.cartItemId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

cartItemRouter.patch(
  '/users/:userId/cart/items/:cartItemId',
  (req, res, next) => {
    try {
      cartItemService.changePurchaseQuantity(
        req.params.cartItemId,
        req.body.purchaseQuantity,
      );
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
);
