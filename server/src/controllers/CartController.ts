import type { Request, Response } from "express";

import { cartService } from "../services/CartService.js";
import type { IdParams } from "../type.js";

export const cartController = {
  getCartItems(_req: Request, res: Response) {
    res.status(200).json(cartService.getCartItems());
  },

  updateQuantity(req: Request<IdParams>, res: Response) {
    const id = req.params.id;
    const quantity = cartService.updateQuantity(id, req.body);

    res.status(200).json({ id, quantity });
  },

  deleteCartItem(req: Request<IdParams>, res: Response) {
    cartService.deleteCartItem(req.params.id);
    res.sendStatus(204);
  },
};
