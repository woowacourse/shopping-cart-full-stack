import { http, HttpResponse } from 'msw';
import { coupons, maxCouponCount } from '../data/couponData';

export const couponHandlers = [
  http.get('/api/coupons/', () => {
    return HttpResponse.json({
      maxCouponCount,
      coupons,
    });
  }),
];
