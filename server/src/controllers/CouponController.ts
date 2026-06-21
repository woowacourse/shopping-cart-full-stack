import type {Request, Response} from 'express';

import {couponService} from '../services/CouponService.js';
import {preorderService} from '../services/PreorderService.js';

export const couponController = {
  getCoupons(req: Request, res: Response) {
    const preorderId = req.query.preorderId;

    const preorder = preorderService.getPreorder(preorderId);
    const coupons = couponService.getCoupons(preorder);

    res.status(200).json({
      body: {
        coupons,
      },
    });
  },
};
