import type {CreateOrderRequestBody, PreviewOrderRequestBody} from '../../types/order.js';

const MAX_COUPON_COUNT = 2;

export const isValidPreviewOrderBody = (body: unknown): body is PreviewOrderRequestBody => {
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

export const isValidCreateOrderBody = (body: unknown): body is CreateOrderRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const {preorderId, expectedTotalPaymentAmount} = body as CreateOrderRequestBody;

  return (
    typeof preorderId === 'string' &&
    preorderId.trim().length > 0 &&
    typeof expectedTotalPaymentAmount === 'number'
  );
};
