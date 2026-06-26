import express from 'express';

import BaseCoupon from '../models/coupons/Coupon.js';
import { MAX_COUPON_COUNT } from '../constants/policy.js';
import { Storage } from '../storages/Storage.js';

export interface CouponController {
  getAll: express.RequestHandler;
}

export function createCouponController(storage: Storage): CouponController {
  return {
    getAll: (_req, res, next) => {
      try {
        const coupons = storage.allItems<BaseCoupon>('coupons');

        res.status(200).send({
          maxCouponCount: MAX_COUPON_COUNT,
          coupons: coupons.map((coupon) => coupon.toObject()),
        });
      } catch (err) {
        next(err);
      }
    },
  };
}
