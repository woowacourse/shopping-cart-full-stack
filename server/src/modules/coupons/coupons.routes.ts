import { Router } from 'express';
import { couponService } from './coupons.service.js';

export const couponRouter = Router();

couponRouter.get('/orders/:orderId/coupons', (req, res, next) => {
  try {
    const coupons = couponService.getCoupons(req.params.orderId);
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
});
