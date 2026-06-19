import {preorderCache} from '../caches/PreorderCache.js';
import {coupons} from '../repositories/index.js';
import {HttpError} from '../middlewares/errorHandler.js';

import {getCouponDisabledReason} from '../domain/couponPolicy.js';
import {calculateOrderAmount, calculateShippingFee} from '../domain/orderPolicy.js';

import type {Coupon} from '../types/coupon.js';
import type {ExcludedCoupon, PreviewOrderRequestBody} from '../types/order.js';

const isValidPreviewOrderBody = (body: unknown): body is PreviewOrderRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const {preorderId, isRemoteArea, couponIds} = body as PreviewOrderRequestBody;

  return (
    typeof preorderId === 'string' &&
    preorderId.length > 0 &&
    typeof isRemoteArea === 'boolean' &&
    Array.isArray(couponIds) &&
    couponIds.every((couponId) => Number.isInteger(couponId))
  );
};

const findCouponById = (couponId: number) => {
  return coupons.find((coupon) => coupon.id === couponId);
};

export const orderService = {
  previewOrder(body: unknown) {
    if (!isValidPreviewOrderBody(body)) {
      throw new HttpError(400, '주문 미리보기 요청 값을 올바르게 입력해주세요.');
    }

    const {preorderId, couponIds, isRemoteArea} = body;

    const preorder = preorderCache.findById(preorderId);

    if (!preorder) {
      throw new HttpError(404, '주문 확인 정보를 찾을 수 없습니다.');
    }

    const applicableCoupons: Coupon[] = [];
    const excludedCoupons: ExcludedCoupon[] = [];

    couponIds.forEach((couponId) => {
      const coupon = findCouponById(couponId);

      if (!coupon) {
        excludedCoupons.push({
          couponId,
          code: '',
          name: '',
          excludedReason: '존재하지 않는 쿠폰입니다.',
        });
        return;
      }

      const disabledReason = getCouponDisabledReason(coupon, {
        preorderId,
        items: preorder.items,
      });

      if (disabledReason) {
        excludedCoupons.push({
          couponId: coupon.id,
          code: coupon.code,
          name: coupon.name,
          excludedReason: disabledReason,
        });
        return;
      }

      applicableCoupons.push(coupon);
    });

    const orderAmount = calculateOrderAmount(preorder.items);
    const shippingFee = calculateShippingFee(isRemoteArea);

    const isSaved = preorderCache.savePreview(preorderId, {
      couponIds,
      isRemoteArea,
    });

    if (!isSaved) {
      throw new HttpError(404, '주문 확인 정보를 찾을 수 없습니다.');
    }

    return {
      price: {
        orderAmount,
        productDiscountAmount: 0,
        shippingDiscountAmount: 0,
        totalDiscountAmount: 0,
        shippingFee,
        totalPaymentAmount: orderAmount + shippingFee,
      },
      appliedCoupons: [],
      excludedCoupons,
    };
  },
};
