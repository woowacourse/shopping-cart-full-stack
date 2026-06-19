import {preorderCache} from '../caches/PreorderCache.js';
import {HttpError} from '../middlewares/errorHandler.js';

import type {PreviewOrderRequestBody} from '../type.js';

const DEFAULT_SHIPPING_FEE = 3000;
const REMOTE_AREA_FEE = 3000;

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

    const orderAmount = preorder.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const shippingFee = DEFAULT_SHIPPING_FEE + (isRemoteArea ? REMOTE_AREA_FEE : 0);

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
      excludedCoupons: [],
    };
  },
};
