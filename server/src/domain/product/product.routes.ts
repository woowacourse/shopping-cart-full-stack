import { Router } from 'express';
import ProductController from './product.controller.js';

export function createProductRouter(controller: ProductController) {
  const router = Router();

  router.get('/', controller.getProducts);
  router.post('/', controller.addProduct);
  router.delete('/:productId', controller.deleteProduct);

  return router;
}
