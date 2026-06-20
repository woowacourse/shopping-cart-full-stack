import type {Request, Response} from 'express';

import {couponService} from '../services/CouponService.js';

export const couponController = {
  getCoupons(req: Request, res: Response) {
    const preorderId = req.query.preorderId;

    const coupons = couponService.getCoupons(preorderId);

    res.status(200).json({
      body: {
        coupons,
      },
    });
  },
};
