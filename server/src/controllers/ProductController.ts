import type {Request, Response} from 'express';

import {productService} from '../services/ProductService.js';
import type {CreateProductRequestBody, IdParams} from '../type.js';

export const productController = {
  getProducts(_req: Request, res: Response) {
    res.status(200).json({
      body: productService.getProducts(),
    });
  },

  createProduct(req: Request<{}, unknown, CreateProductRequestBody>, res: Response) {
    const result = productService.createProduct(req.body);

    if (result.status === 'invalid') {
      return res.status(400).send();
    }

    if (result.status === 'duplicated') {
      return res.status(409).send();
    }

    res.status(201).json({
      body: {
        id: result.id,
      },
    });
  },

  deleteProduct(req: Request<IdParams>, res: Response) {
    const reqId = req.params.id;

    const result = productService.deleteProduct(reqId);

    if (result.status === 'notFound') {
      return res.status(404).send();
    }

    res.sendStatus(204);
  },
};
