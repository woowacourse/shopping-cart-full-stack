import { Router } from 'express';
import {
    postOrderCheck,
    getOrderCheck,
    getOrderCheckPayInfo,
    patchRemoteAreaSelection,
    getOrderCheckCoupons,
    patchOrderCheckCoupons,
    postOrderCheckCouponDiscount,
} from '../controllers/OrderCheckController.js';

const orderCheckRouter = Router();

orderCheckRouter.post('/order-check', postOrderCheck);
orderCheckRouter.get('/order-check', getOrderCheck);
orderCheckRouter.get('/order-check/pay-info', getOrderCheckPayInfo);
orderCheckRouter.patch('/order-check/select/remote-areas', patchRemoteAreaSelection);
orderCheckRouter.get('/order-check/coupons', getOrderCheckCoupons);
orderCheckRouter.patch('/order-check/coupons', patchOrderCheckCoupons);
orderCheckRouter.post('/order-check/coupons', postOrderCheckCouponDiscount);

export default orderCheckRouter;
