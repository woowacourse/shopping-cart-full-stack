import {
  DEFAULT_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  REMOTE_SHIPPING_SURCHARGE,
} from '../constants/policy.js';
import OrderSheet from '../models/OrderSheet.js';
import { CouponContext } from '../models/coupons/Coupon.js';

export interface OrderSheetPricingSummary {
  orderAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalPaymentAmount: number;
}

export function createPricingContext(orderSheet: OrderSheet): CouponContext {
  const orderAmount = calculateOrderAmount(orderSheet);
  const { isRemoteShippingArea } = orderSheet.toObject();
  const shippingFee = calculateShippingFee(
    orderAmount,
    isRemoteShippingArea,
  );

  return {
    orderSheet,
    orderAmount,
    shippingFee,
    now: new Date(),
  };
}

export function calculateOrderAmount(orderSheet: OrderSheet) {
  return orderSheet
    .toObject()
    .items.reduce(
      (total, { product, quantity }) => total + product.price * quantity,
      0,
    );
}

export function calculateShippingFee(
  orderAmount: number,
  isRemoteShippingArea: boolean,
) {
  if (orderAmount >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  const remoteShippingFee = isRemoteShippingArea
    ? REMOTE_SHIPPING_SURCHARGE
    : 0;

  return DEFAULT_SHIPPING_FEE + remoteShippingFee;
}

export function createPricingSummary(
  context: CouponContext,
  discountAmount: number,
): OrderSheetPricingSummary {
  return {
    orderAmount: context.orderAmount,
    shippingFee: context.shippingFee,
    discountAmount,
    totalPaymentAmount:
      context.orderAmount + context.shippingFee - discountAmount,
  };
}
