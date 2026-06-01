import type { Request, Response } from "express";
import { productService } from "../services/ProductService.js";
import type { IdParams } from "../type.js";

export const productController = {
  getProducts(_req: Request, res: Response) {
    res.status(200).json(productService.getProducts());
  },

  createProduct(req: Request, res: Response) {
    const product = productService.createProduct(req.body);

    res.status(201).json(product);
  },

  deleteProduct(req: Request<IdParams>, res: Response) {
    productService.deleteProduct(req.params.id);
    res.sendStatus(204);
  },
};
