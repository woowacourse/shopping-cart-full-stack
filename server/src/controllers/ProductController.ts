import type {Request, Response} from 'express';

import {productService} from '../services/ProductService.js';
import type {CreateProductRequestBody, ProductIdParams} from '../type.js';

export const productController = {
  getProducts(_req: Request, res: Response) {
    res.status(200).json({
      body: productService.getProducts(),
    });
  },

  createProduct(req: Request<{}, unknown, CreateProductRequestBody>, res: Response) {
    const productId = productService.createProduct(req.body);

    res.status(201).json({
      body: {
        id: productId,
      },
    });
  },

  deleteProduct(req: Request<ProductIdParams>, res: Response) {
    const productId = req.params.productId;

    productService.deleteProduct(productId);

    res.sendStatus(204);
  },
};
