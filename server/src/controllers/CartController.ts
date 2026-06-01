import type {Request, Response} from 'express';

import {cartService} from '../services/CartService.js';
import type {CartItemIdParams, UpdateCartQuantityRequestBody} from '../type.js';

export const cartController = {
  getCartItems(_req: Request, res: Response) {
    res.status(200).json({
      body: cartService.getCartItems(),
    });
  },

  updateQuantity(req: Request<CartItemIdParams, unknown, UpdateCartQuantityRequestBody>, res: Response) {
    const cartItemId = req.params.cartItemId;
    const {quantity} = req.body;
    const updatedQuantity = cartService.updateQuantity(cartItemId, quantity);

    res.status(200).json({
      body: {
        id: cartItemId,
        quantity: updatedQuantity,
      },
    });
  },

  deleteCartItem(req: Request<CartItemIdParams>, res: Response) {
    const cartItemId = req.params.cartItemId;
    cartService.deleteCartItem(cartItemId);

    res.sendStatus(204);
  },
};
