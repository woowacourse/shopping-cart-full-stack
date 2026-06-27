import type { Request, Response } from "express";

import { productService } from "../container.js";
import type { IdParams } from "../type.js";

export const productController = {
  async getProducts(_req: Request, res: Response) {
    res.status(200).json(await productService.getProducts());
  },

  async createProduct(req: Request, res: Response) {
    const product = await productService.createProduct(req.body);

    res.status(201).json(product);
  },

  async deleteProduct(req: Request<IdParams>, res: Response) {
    await productService.deleteProduct(req.params.id);
    res.sendStatus(204);
  },
};
