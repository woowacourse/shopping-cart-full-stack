import {randomUUID} from 'node:crypto';

import {preorderCache} from '../caches/PreorderCache.js';
import {cartItems, orders} from '../repositories/index.js';
import {HttpError} from '../middlewares/errorHandler.js';
import {preorderService} from './PreorderService.js';
import {Order} from '../models/Order.js';

import {calculateOrderAmount, calculateShippingFee} from '../domain/order/orderPolicy.js';
import {getPreviewCoupons} from '../domain/order/orderCouponPolicy.js';
import {calculateBestOrderPricing} from '../domain/order/orderPricingPolicy.js';
import {isValidCreateOrderBody, isValidPreviewOrderBody} from '../domain/order/orderRequestValidator.js';

import type {
  CreateOrderResponse,
  OrderSummaryResponse,
  PreviewOrderResponse,
} from '../types/order.js';

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

const calculateOrder = (preorderId: string, couponIds: number[], isRemoteArea: boolean) => {
  const preorder = preorderService.getPreorder(preorderId);
  const orderAmount = calculateOrderAmount(preorder.items);
  const shippingFee = calculateShippingFee(orderAmount, isRemoteArea);
  const {applicableCoupons, excludedCoupons} = getPreviewCoupons(couponIds, preorderId, preorder.items, isRemoteArea);
  const {price, appliedCoupons, benefitItems} = calculateBestOrderPricing(
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
    benefitItems,
  };
};

export const orderService = {
  previewOrder(body: unknown): PreviewOrderResponse {
    if (!isValidPreviewOrderBody(body)) {
      throw new HttpError(400, '주문 미리보기 요청 값을 올바르게 입력해주세요.');
    }

    const {preorderId, couponIds, isRemoteArea} = body;

    const {price, appliedCoupons, excludedCoupons, benefitItems} = calculateOrder(preorderId, couponIds, isRemoteArea);

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
      benefitItems,
    };
  },

  createOrder(body: unknown): CreateOrderResponse {
    if (!isValidCreateOrderBody(body)) {
      throw new HttpError(400, '주문 생성 요청 값을 올바르게 입력해주세요.');
    }

    const {preorderId, expectedTotalPaymentAmount} = body;
    const preview = getPreorderPreview(preorderId);
    const {preorder, price, excludedCoupons, benefitItems} = calculateOrder(
      preorderId,
      preview.couponIds,
      preview.isRemoteArea
    );

    if (excludedCoupons.length > 0) {
      throw new HttpError(409, '적용할 수 없는 쿠폰이 포함되어 있습니다.');
    }

    if (price.totalPaymentAmount !== expectedTotalPaymentAmount) {
      throw new HttpError(409, '서버에서 다시 계산한 결제 금액이 화면에 표시된 금액과 일치하지 않습니다.');
    }

    const orderId = randomUUID();
    const order = new Order(orderId, preorder.items, benefitItems, price.totalPaymentAmount);
    const preorderSession = preorderCache.findById(preorderId);

    if (!preorderSession) {
      throw new HttpError(404, '주문 확인 정보를 찾을 수 없습니다.');
    }

    preorderSession.items.forEach(({cartItemId}) => {
      cartItems.deleteById(cartItemId);
    });
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
