import { Router } from 'express';
import type { CartItemService } from '../cart/cartItem.service.js';
import type { ProductService } from './product.service.js';

export const createProductRouter = (
  productService: ProductService,
  cartItemService: CartItemService,
) => {
  const router = Router();

  router.get('/products', (_req, res, next) => {
    try {
      const product = productService.getProducts();
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  });

  router.post('/products', (req, res, next) => {
    try {
      const product = productService.addProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/products/:productId', (req, res, next) => {
    try {
      // 상품 삭제 시 장바구니 정리까지 함께 조율한다
      productService.deleteProduct(req.params.productId);
      cartItemService.deleteByProductId(req.params.productId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
};
