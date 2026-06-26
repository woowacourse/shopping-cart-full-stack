import { Router } from 'express';
import CartController from './cart.controller.js';

export function createCartRouter(controller: CartController) {
  const router = Router();

  router.get('/', controller.getCartItems);
  router.get('/payment', controller.getCartPayment);
  router.post('/:cartItemId', controller.addCartItem);
  router.delete('/:cartItemId', controller.deleteCartItem);
  router.patch('/:cartItemId', controller.updateCartItem);

  return router;
}
