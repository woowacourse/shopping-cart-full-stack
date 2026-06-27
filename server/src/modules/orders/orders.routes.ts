import { Router } from 'express';
import { orderService } from './orders.service.js';

export const orderRouter = Router();

orderRouter.get('/orders/:orderId', (req, res, next) => {
  try {
    const order = orderService.getOrder(req.params.orderId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});
orderRouter.post('/orders', (req, res, next) => {
  try {
    const order = orderService.addOrder(req.body);

    const responseBody = { orderId: order.orderId };

    return res.status(201).json(responseBody);
  } catch (error) {
    next(error);
  }
});

orderRouter.patch('/orders/:orderId/coupons', (req, res, next) => {
  try {
    const order = orderService.applyCoupons(
      req.params.orderId,
      req.body?.couponIds,
    );

    res.status(200).json({
      couponIds: order.couponIds,
      priceInfo: order.priceInfo,
    });
  } catch (error) {
    next(error);
  }
});

orderRouter.post('/orders/:orderId/discount-price', (req, res, next) => {
  try {
    const discount = orderService.previewCouponDiscount(
      req.params.orderId,
      req.body?.couponIds,
    );

    res.status(200).json(discount);
  } catch (error) {
    next(error);
  }
});

orderRouter.patch('/orders/:orderId/delivery-area', (req, res, next) => {
  try {
    const order = orderService.changeDeliveryArea(
      req.params.orderId,
      req.body?.isIsland,
    );

    res.status(200).json({
      couponIds: order.couponIds,
      priceInfo: order.priceInfo,
    });
  } catch (error) {
    next(error);
  }
});
