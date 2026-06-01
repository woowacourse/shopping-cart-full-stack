import type { Request, Response } from 'express';

import { wrap } from '../../common/wrap.ts';
import { success } from '../../common/response.ts';
import * as cartsService from './carts.service.ts';

export const getCartById = wrap((req: Request, res: Response) => {
    const cartId = Number(req.params.cartId);
    const cart = cartsService.getCartById(cartId);

    return success(res, cart);
});

export const updateCartProduct = wrap((req: Request, res: Response) => {
    const cartId = Number(req.params.cartId);
    const productId = Number(req.params.productId);
    const product = cartsService.updateCartProduct(cartId, productId, req.body);

    return success(res, product, 201);
});

export const deleteCartProduct = wrap((req: Request, res: Response) => {
    const cartId = Number(req.params.cartId);
    const productId = Number(req.params.productId);
    cartsService.deleteCartProduct(cartId, productId);

    return res.status(204).send();
});
