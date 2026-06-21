import {randomUUID} from 'node:crypto';

import {preorderCache} from '../caches/PreorderCache.js';
import {cartItems, coupons, orders} from '../repositories/index.js';
import {HttpError} from '../middlewares/errorHandler.js';
import {preorderService} from './PreorderService.js';
import {Order} from '../models/Order.js';

import {validateCoupon} from '../domain/couponPolicy.js';
import {calculateOrderAmount, calculateShippingFee} from '../domain/orderPolicy.js';
import {calculateBestOrderPricing} from '../domain/orderPricingPolicy.js';

import type {Coupon} from '../models/Coupon.js';
import type {
  CreateOrderRequestBody,
  CreateOrderResponse,
  ExcludedCoupon,
  OrderSummaryResponse,
  PreviewOrderRequestBody,
  PreviewOrderResponse,
} from '../types/order.js';
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

const isValidCreateOrderBody = (body: unknown): body is CreateOrderRequestBody => {
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

const toExcludedCoupon = (couponId: number, excludedReason: string, coupon?: Coupon): ExcludedCoupon => {
  return {
    couponId,
    code: coupon?.code ?? '',
    name: coupon?.name ?? '',
    excludedReason,
  };
};

const getPreviewCoupons = (couponIds: number[], preorderId: string, items: PreorderItem[], isRemoteArea: boolean) => {
  const applicableCoupons: Coupon[] = [];
  const excludedCoupons: ExcludedCoupon[] = [];

  couponIds.forEach((couponId) => {
    const coupon = coupons.findById(couponId);

    if (!coupon) {
      excludedCoupons.push(toExcludedCoupon(couponId, '존재하지 않는 쿠폰입니다.'));
      return;
    }

    const validationResult = validateCoupon(coupon, {preorderId, items}, {isRemoteArea});

    if (!validationResult.valid) {
      excludedCoupons.push(toExcludedCoupon(coupon.id, validationResult.reason, coupon));
      return;
    }

    applicableCoupons.push(coupon);
  });

  return {applicableCoupons, excludedCoupons};
};

const getPreorderPreview = (preorderId: string) => {
  const preorderSession = preorderCache.findById(preorderId);

  if (!preorderSession) {
    throw new HttpError(404, '주문 확인 정보를 찾을 수 없습니다.');
  }

  if (!preorderSession.preview) {
    throw new HttpError(400, '결제 금액 미리보기를 먼저 진행해주세요.');
  }

  return preorderSession.preview;
};

const deleteSelectedCartItems = (preorderId: string) => {
  const preorderSession = preorderCache.findById(preorderId);

  if (!preorderSession) {
    throw new HttpError(404, '주문 확인 정보를 찾을 수 없습니다.');
  }

  preorderSession.items.forEach(({cartItemId}) => {
    cartItems.deleteById(cartItemId);
  });
};

const calculateOrder = (preorderId: string, couponIds: number[], isRemoteArea: boolean) => {
  const preorder = preorderService.getPreorder(preorderId);
  const orderAmount = calculateOrderAmount(preorder.items);
  const shippingFee = calculateShippingFee(orderAmount, isRemoteArea);
  const {applicableCoupons, excludedCoupons} = getPreviewCoupons(couponIds, preorderId, preorder.items, isRemoteArea);
  const {price, appliedCoupons} = calculateBestOrderPricing(
    applicableCoupons,
    preorder.items,
    orderAmount,
    shippingFee
  );

  return {
    preorder,
    price,
    appliedCoupons,
    excludedCoupons,
  };
};

export const orderService = {
  previewOrder(body: unknown): PreviewOrderResponse {
    if (!isValidPreviewOrderBody(body)) {
      throw new HttpError(400, '주문 미리보기 요청 값을 올바르게 입력해주세요.');
    }

    const {preorderId, couponIds, isRemoteArea} = body;

    const {price, appliedCoupons, excludedCoupons} = calculateOrder(preorderId, couponIds, isRemoteArea);

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

  createOrder(body: unknown): CreateOrderResponse {
    if (!isValidCreateOrderBody(body)) {
      throw new HttpError(400, '주문 생성 요청 값을 올바르게 입력해주세요.');
    }

    const {preorderId, expectedTotalPaymentAmount} = body;
    const preview = getPreorderPreview(preorderId);
    const {preorder, price, excludedCoupons} = calculateOrder(preorderId, preview.couponIds, preview.isRemoteArea);

    if (excludedCoupons.length > 0) {
      throw new HttpError(409, '적용할 수 없는 쿠폰이 포함되어 있습니다.');
    }

    if (price.totalPaymentAmount !== expectedTotalPaymentAmount) {
      throw new HttpError(409, '서버에서 다시 계산한 결제 금액이 화면에 표시된 금액과 일치하지 않습니다.');
    }

    const orderId = randomUUID();
    const order = new Order(orderId, preorder.items, price.totalPaymentAmount);

    deleteSelectedCartItems(preorderId);
    orders.add(order);
    preorderCache.deleteById(preorderId);

    return {
      orderId,
    };
  },

  getOrderSummary(orderId: string): OrderSummaryResponse {
    const order = orders.findById(orderId);

    if (!order) {
      throw new HttpError(404, '주문 정보를 찾을 수 없습니다.');
    }

    return {
      itemCount: order.getItemCount(),
      totalQuantity: order.getTotalQuantity(),
      totalAmount: order.getTotalAmount(),
    };
  },
};
