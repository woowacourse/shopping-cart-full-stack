import { Router } from 'express';
import type { NextFunction, Response } from 'express';

import {
  calculateOrderCouponDiscount,
  createOrder,
  getOrder,
  getOrderCoupons,
  hasCoupons,
  hasDisabledCoupon,
  hasOrder,
  isDuplicatedCoupons,
  isExceededCouponLimit,
  updateOrderCoupons,
  updateOrderRemoteArea,
} from './service/orderService.ts';
import type { CouponCode, CouponWithState, OrderData } from './types/type.ts';

const router = Router();

function sendError(error: unknown, res: Response, next: NextFunction) {
  if (!(error instanceof Error)) {
    return next(error);
  }

  if (
    error.message === '주문을 찾을 수 없습니다.' ||
    error.message === '상품을 찾을 수 없습니다.' ||
    error.message === '쿠폰을 찾을 수 없습니다.'
  ) {
    return res.status(404).send({ message: error.message });
  }

  return res.status(400).send({ message: error.message });
}

function formatOrderResponse(order: OrderData) {
  return {
    products: order.products,
    isRemoteArea: order.isRemoteArea,
    amount: order.amount,
  };
}

function formatCouponResponse(coupon: CouponWithState) {
  return {
    id: coupon.code,
    isSelected: coupon.isSelected,
    isDisabled: coupon.isDisabled,
    name: coupon.name,
    dueDate: coupon.expiresAt,
    minOrderAmount: 'minOrderAmount' in coupon ? coupon.minOrderAmount : undefined,
    availableTime:
      coupon.code === 'MIRACLESALE'
        ? { startTime: coupon.startTime, endTime: coupon.endTime }
        : undefined,
  };
}

router.post('/', (req, res, next) => {
  try {
    const items = req.body.items;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some(({ productId, quantity }) => {
        return typeof productId !== 'string' || typeof quantity !== 'number';
      })
    ) {
      return res.status(400).send({ message: '유효하지 않은 형식입니다.' });
    }

    res.status(201).send(createOrder(items));
  } catch (error) {
    sendError(error, res, next);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    if (!hasOrder(req.params.id)) {
      return res.status(404).send({ message: '주문을 찾을 수 없습니다.' });
    }

    res.status(200).send(formatOrderResponse(getOrder(req.params.id)));
  } catch (error) {
    sendError(error, res, next);
  }
});

router.patch('/:id', (req, res, next) => {
  try {
    if (!hasOrder(req.params.id)) {
      return res.status(404).send({ message: '주문을 찾을 수 없습니다.' });
    }

    if (typeof req.body.isRemoteArea !== 'boolean') {
      return res.status(400).send({ message: '유효하지 않은 형식입니다.' });
    }

    updateOrderRemoteArea(req.params.id, req.body.isRemoteArea);
    res.status(204).send();
  } catch (error) {
    sendError(error, res, next);
  }
});

router.get('/:id/coupons', (req, res, next) => {
  try {
    if (!hasOrder(req.params.id)) {
      return res.status(404).send({ message: '주문을 찾을 수 없습니다.' });
    }

    res
      .status(200)
      .send(getOrderCoupons(req.params.id).map(formatCouponResponse));
  } catch (error) {
    sendError(error, res, next);
  }
});

router.post('/:id/coupons/discount', (req, res, next) => {
  try {
    if (!hasOrder(req.params.id)) {
      return res.status(404).send({ message: '주문을 찾을 수 없습니다.' });
    }

    const couponCodes = req.body.coupons;

    if (
      !Array.isArray(couponCodes) ||
      couponCodes.some((couponCode) => typeof couponCode !== 'string')
    ) {
      return res.status(400).send({ message: '유효하지 않은 형식입니다.' });
    }

    if (!hasCoupons(couponCodes)) {
      return res.status(404).send({ message: '쿠폰을 찾을 수 없습니다.' });
    }

    if (isExceededCouponLimit(couponCodes)) {
      return res
        .status(400)
        .send({ message: '쿠폰은 최대 2개까지 사용할 수 있습니다.' });
    }

    if (isDuplicatedCoupons(couponCodes)) {
      return res.status(400).send({ message: '쿠폰은 중복 적용할 수 없습니다.' });
    }

    if (hasDisabledCoupon(req.params.id, couponCodes)) {
      return res.status(400).send({ message: '사용할 수 없는 쿠폰입니다.' });
    }

    res
      .status(200)
      .send(
        calculateOrderCouponDiscount(req.params.id, couponCodes as CouponCode[]),
      );
  } catch (error) {
    sendError(error, res, next);
  }
});

router.patch('/:id/coupons', (req, res, next) => {
  try {
    if (!hasOrder(req.params.id)) {
      return res.status(404).send({ message: '주문을 찾을 수 없습니다.' });
    }

    const couponCodes = req.body.coupons;

    if (
      !Array.isArray(couponCodes) ||
      couponCodes.some((couponCode) => typeof couponCode !== 'string')
    ) {
      return res.status(400).send({ message: '유효하지 않은 형식입니다.' });
    }

    if (!hasCoupons(couponCodes)) {
      return res.status(404).send({ message: '쿠폰을 찾을 수 없습니다.' });
    }

    if (isExceededCouponLimit(couponCodes)) {
      return res
        .status(400)
        .send({ message: '쿠폰은 최대 2개까지 사용할 수 있습니다.' });
    }

    if (isDuplicatedCoupons(couponCodes)) {
      return res.status(400).send({ message: '쿠폰은 중복 적용할 수 없습니다.' });
    }

    if (hasDisabledCoupon(req.params.id, couponCodes)) {
      return res.status(400).send({ message: '사용할 수 없는 쿠폰입니다.' });
    }

    updateOrderCoupons(req.params.id, couponCodes as CouponCode[]);
    res.status(204).send();
  } catch (error) {
    sendError(error, res, next);
  }
});

export default router;
