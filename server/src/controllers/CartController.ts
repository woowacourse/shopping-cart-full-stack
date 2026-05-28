import type {Request, Response} from 'express';

import {cartService} from '../services/CartService.js';
import type {IdParams, UpdateCartQuantityRequestBody} from '../type.js';

export const cartController = {
  getCartItems(_req: Request, res: Response) {
    res.status(200).json({
      body: cartService.getCartItems(),
    });
  },

  updateQuantity(req: Request<IdParams, unknown, UpdateCartQuantityRequestBody>, res: Response) {
    const targetId = req.params.id;
    const {quantity} = req.body;
    const result = cartService.updateQuantity(targetId, quantity);

    if (result.status === 'invalid') {
      return res.status(400).send();
    }

    if (result.status === 'notFound') {
      return res.status(404).send();
    }

    res.status(200).json({
      body: {
        id: targetId,
        quantity: result.quantity,
      },
    });
  },

  deleteCartItem(req: Request<IdParams>, res: Response) {
    const reqId = req.params.id;
    const isDeleted = cartService.deleteCartItem(reqId);

    if (!isDeleted) {
      return res.status(404).send();
    }

    res.sendStatus(204);
  },
};
