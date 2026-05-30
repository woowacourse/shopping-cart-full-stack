import type { Request, Response } from 'express';

import { wrap } from '../../common/wrap.ts';
import { success } from '../../common/response.ts';
import * as productsService from './products.service.ts';

export const getProducts = (_req: Request, res: Response) => {
    const products = productsService.getProducts();

    return success(res, products);
};

export const createProduct = wrap((req: Request, res: Response) => {
    const product = productsService.createProduct(req.body);

    return success(res, product);
});

export const deleteProduct = wrap((req: Request, res: Response) => {
    const id = Number(req.params.id);
    productsService.deleteProduct(id);

    return res.status(204).send();
});
