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
    const result = cartService.updateQuantity(cartItemId, quantity);

    if (result.status === 'invalid') {
      return res.status(400).send();
    }

    if (result.status === 'notFound') {
      return res.status(404).send();
    }

    res.status(200).json({
      body: {
        id: cartItemId,
        quantity: result.quantity,
      },
    });
  },

  deleteCartItem(req: Request<CartItemIdParams>, res: Response) {
    const cartItemId = req.params.cartItemId;
    const isDeleted = cartService.deleteCartItem(cartItemId);

    if (!isDeleted) {
      return res.status(404).send();
    }

    res.sendStatus(204);
  },
};
