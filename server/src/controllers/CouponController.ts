import type {Request, Response} from 'express';

import {couponService} from '../services/CouponService.js';
import {preorderService} from '../services/PreorderService.js';

export const couponController = {
  getCoupons(req: Request, res: Response) {
    const preorderId = req.query.preorderId;
    const isRemoteArea = req.query.isRemoteArea === 'true';

    const preorder = preorderService.getPreorder(preorderId);
    const {coupons, recommendedCouponIds} = couponService.getCoupons(preorder, isRemoteArea);

    res.status(200).json({
      body: {
        coupons,
        recommendedCouponIds,
      },
    });
  },
};
