import {preorderCache} from '../caches/PreorderCache.js';
import {coupons} from '../repositories/index.js';
import {HttpError} from '../middlewares/errorHandler.js';
import {preorderService} from './PreorderService.js';

import {validateCoupon} from '../domain/couponPolicy.js';
import {calculateOrderAmount, calculateShippingFee} from '../domain/orderPolicy.js';
import {calculateBestOrderPricing} from '../domain/orderPricingPolicy.js';

import type {Coupon} from '../models/Coupon.js';
import type {ExcludedCoupon, PreviewOrderRequestBody, PreviewOrderResponse} from '../types/order.js';
import type {PreorderItem} from '../types/preorder.js';

const MAX_COUPON_COUNT = 2;

const isValidPreviewOrderBody = (body: unknown): body is PreviewOrderRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const {preorderId, isRemoteArea, couponIds} = body as PreviewOrderRequestBody;

  return (
    typeof isRemoteArea === 'boolean' &&
    typeof preorderId === 'string' &&
    preorderId.trim().length > 0 &&
    Array.isArray(couponIds) &&
    couponIds.length <= MAX_COUPON_COUNT &&
    couponIds.every(Number.isInteger)
  );
};

const toExcludedCoupon = (couponId: number, excludedReason: string, coupon?: Coupon): ExcludedCoupon => {
  return {
    couponId,
    code: coupon?.code ?? '',
    name: coupon?.name ?? '',
    excludedReason,
  };
};

const getPreviewCoupons = (couponIds: number[], preorderId: string, items: PreorderItem[]) => {
  const applicableCoupons: Coupon[] = [];
  const excludedCoupons: ExcludedCoupon[] = [];

  couponIds.forEach((couponId) => {
    const coupon = coupons.findById(couponId);

    if (!coupon) {
      excludedCoupons.push(toExcludedCoupon(couponId, '존재하지 않는 쿠폰입니다.'));
      return;
    }

    const validationResult = validateCoupon(coupon, {preorderId, items});

    if (!validationResult.valid) {
      excludedCoupons.push(toExcludedCoupon(coupon.id, validationResult.reason, coupon));
      return;
    }

    applicableCoupons.push(coupon);
  });

  return {applicableCoupons, excludedCoupons};
};

export const orderService = {
  previewOrder(body: unknown): PreviewOrderResponse {
    if (!isValidPreviewOrderBody(body)) {
      throw new HttpError(400, '주문 미리보기 요청 값을 올바르게 입력해주세요.');
    }

    const {preorderId, couponIds, isRemoteArea} = body;

    const preorder = preorderService.getPreorder(preorderId);

    const orderAmount = calculateOrderAmount(preorder.items);
    const shippingFee = calculateShippingFee(orderAmount, isRemoteArea);
    const {applicableCoupons, excludedCoupons} = getPreviewCoupons(couponIds, preorderId, preorder.items);
    const {price, appliedCoupons} = calculateBestOrderPricing(
      applicableCoupons,
      preorder.items,
      orderAmount,
      shippingFee
    );

    const isSaved = preorderCache.savePreview(preorderId, {
      couponIds: appliedCoupons.map((coupon) => coupon.couponId),
      isRemoteArea,
    });

    if (!isSaved) {
      throw new HttpError(404, '주문 확인 정보를 찾을 수 없습니다.');
    }

    return {
      price,
      appliedCoupons,
      excludedCoupons,
    };
  },
};
