import { Router } from 'express';
import { cartItemService } from './cartItem.service.js';
import {
  parseAddCartItemRequest,
  parseChangePurchaseQuantityRequest,
} from './cartItem.request.js';

export const cartItemRouter = Router();

cartItemRouter.get('/cart/items', (_req, res, next) => {
  try {
    const cartItems = cartItemService.getCartItems();
    res.status(200).json(cartItems);
  } catch (error) {
    next(error);
  }
});
cartItemRouter.post('/cart/items', (req, res, next) => {
  try {
    const cartItemRequest = parseAddCartItemRequest(req.body ?? {});
    const cartItem = cartItemService.addCartItem(cartItemRequest);

    const responseBody = { cartItemId: cartItem.cartItemId };

    if (cartItem.isNew) return res.status(201).json(responseBody);

    return res.status(200).json(responseBody);
  } catch (error) {
    next(error);
  }
});

cartItemRouter.delete('/cart/items/:cartItemId', (req, res, next) => {
  try {
    cartItemService.deleteCartItem(req.params.cartItemId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

cartItemRouter.patch('/cart/items/:cartItemId', (req, res, next) => {
  try {
    const { purchaseQuantity } = parseChangePurchaseQuantityRequest(
      req.body ?? {},
    );

    const cartItem = cartItemService.changePurchaseQuantity(
      req.params.cartItemId,
      purchaseQuantity,
    );

    const responseBody = {
      cartItemId: cartItem.cartItemId,
      purchaseQuantity: cartItem.purchaseQuantity,
    };

    res.status(200).send(responseBody);
  } catch (error) {
    next(error);
  }
});
