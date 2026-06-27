import type { Request, Response } from "express";

import { cartService } from "../container.js";
import type { IdParams } from "../type.js";

export const cartController = {
  async getCartItems(_req: Request, res: Response) {
    res.status(200).json(await cartService.getCartItems());
  },

  async updateQuantity(req: Request<IdParams>, res: Response) {
    const cartItem = await cartService.updateQuantity(req.params.id, req.body);

    res.status(200).json(cartItem);
  },

  async deleteCartItem(req: Request<IdParams>, res: Response) {
    await cartService.deleteCartItem(req.params.id);
    res.sendStatus(204);
  },
};
