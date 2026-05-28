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
    const {name, price, imageUrl} = req.body;
    const newId = productService.createProduct({name, price, imageUrl});

    if (newId === null) {
      return res.status(409).send();
    }

    res.status(201).json({
      body: {
        id: newId,
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
