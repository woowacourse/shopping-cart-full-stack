import { Router } from 'express';
import OrderController from './order.controller.js';

export function createOrderRouter(controller: OrderController) {
  const router = Router();

  router.post('/', controller.createOrder);
  router.get('/:orderId', controller.getOrder);
  router.patch('/:orderId', controller.updateOrder);

  router.get('/:orderId/coupons', controller.getOrderCoupons);
  router.post('/:orderId/coupons/discount', controller.getCouponsDiscount);
  router.patch('/:orderId/coupons', controller.updateOrderCoupons);

  return router;
}
