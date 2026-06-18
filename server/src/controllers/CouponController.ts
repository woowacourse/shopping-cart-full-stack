import type {Request, Response} from 'express';
import {HttpError} from '../middlewares/errorHandler.js';
import {couponService} from '../services/CouponService.js';

export const couponController = {
  getCoupons(req: Request, res: Response) {
    const preorderId = req.query.preorderId;

    if (typeof preorderId !== 'string') {
      throw new HttpError(400, 'preorderId를 올바르게 입력해주세요.');
    }

    const coupons = couponService.getCoupons(preorderId);

    res.status(200).json({
      body: {
        coupons,
      },
    });
  },
};
