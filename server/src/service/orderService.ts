import { coupons, orders, products } from '../database/inMemoryDatabase.ts';
import {
  calculateBestCouponDiscount,
  calculateSelectedCouponDiscount,
} from '../domain/couponCalculator.ts';
import Order from '../domain/Order.ts';
import type {
  Coupon,
  CouponCode,
  CouponWithState,
  OrderData,
  OrderId,
  OrderProduct,
  ProductId,
  Quantity,
} from '../types/type.ts';

type CreateOrderItem = {
  productId: ProductId;
  quantity: Quantity;
};

type CouponDiscountResult = {
  discountAmount: number;
};

function findOrder(id: OrderId) {
  const order = orders.get(id);

  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }

  return order;
}

export function hasOrder(id: OrderId) {
  return orders.has(id);
}

function createOrderProducts(items: CreateOrderItem[]): OrderProduct[] {
  return items.map(({ productId, quantity }) => {
    const product = products.get(productId);

    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    const productData = product.getProduct();

    return {
      productId,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      quantity,
    };
  });
}

function findCoupons(couponCodes: CouponCode[]): Coupon[] {
  return couponCodes.map((couponCode) => {
    const coupon = coupons.find(({ code }) => code === couponCode);

    if (!coupon) {
      throw new Error('쿠폰을 찾을 수 없습니다.');
    }

    return coupon;
  });
}

export function hasCoupons(couponCodes: string[]) {
  return couponCodes.every((couponCode) => {
    return coupons.some(({ code }) => code === couponCode);
  });
}

export function isExceededCouponLimit(couponCodes: string[]) {
  return couponCodes.length > 2;
}

export function isDuplicatedCoupons(couponCodes: string[]) {
  return new Set(couponCodes).size !== couponCodes.length;
}

function isExpiredCoupon(coupon: Coupon, currentDate: Date) {
  const expiresAt = new Date(`${coupon.expiresAt}T23:59:59`);

  return currentDate > expiresAt;
}

function isAvailableCoupon(order: Order, coupon: Coupon, currentDate: Date) {
  if (isExpiredCoupon(coupon, currentDate)) {
    return false;
  }

  const { discountAmount } = calculateBestCouponDiscount(
    order.getOrder(),
    [coupon],
    currentDate,
  );

  return discountAmount > 0;
}

function calculateSelectedDiscountAmount(
  order: Order,
  selectedCoupons: Coupon[],
  currentDate: Date,
): number {
  const { discountAmount } = calculateSelectedCouponDiscount(
    order.getOrder(),
    selectedCoupons,
    currentDate,
  );

  return discountAmount;
}

function applySelectedCouponsToOrder(
  order: Order,
  selectedCoupons: Coupon[],
  currentDate: Date,
) {
  const discountAmount = calculateSelectedDiscountAmount(
    order,
    selectedCoupons,
    currentDate,
  );

  order.setSelectedCouponCodes(selectedCoupons.map(({ code }) => code));
  order.applyDiscount(discountAmount);
}

function applyBestCouponsToOrder(
  order: Order,
  availableCoupons: Coupon[],
  currentDate: Date,
) {
  const { selectedCoupons, discountAmount } = calculateBestCouponDiscount(
    order.getOrder(),
    availableCoupons,
    currentDate,
  );

  order.setSelectedCouponCodes(selectedCoupons.map(({ code }) => code));
  order.applyDiscount(discountAmount);
}

function createOrderAt(items: CreateOrderItem[], currentDate: Date) {
  const order = new Order();

  order.createOrder(createOrderProducts(items));
  applyBestAvailableCouponsToOrder(order, currentDate);
  orders.set(order.getId(), order);

  return { id: order.getId() };
}

function applyBestAvailableCouponsToOrder(order: Order, currentDate: Date) {
  const availableCoupons = coupons.filter((coupon) => {
    return isAvailableCoupon(order, coupon, currentDate);
  });

  applyBestCouponsToOrder(order, availableCoupons, currentDate);
}

export function createOrder(items: CreateOrderItem[]) {
  return createOrderAt(items, new Date());
}

export function getOrder(id: OrderId): OrderData {
  return findOrder(id).getOrder();
}

export function getOrderCoupons(orderId: OrderId): CouponWithState[] {
  const currentDate = new Date();
  const order = findOrder(orderId);

  return coupons.map((coupon) => ({
    ...coupon,
    isSelected: order.hasSelectedCoupon(coupon.code),
    isDisabled: !isAvailableCoupon(order, coupon, currentDate),
  }));
}

export function hasDisabledCoupon(orderId: OrderId, couponCodes: string[]) {
  return getOrderCoupons(orderId).some(({ code, isDisabled }) => {
    return couponCodes.includes(code) && isDisabled;
  });
}

export function applyBestCoupons(orderId: OrderId) {
  const currentDate = new Date();
  const order = findOrder(orderId);

  applyBestAvailableCouponsToOrder(order, currentDate);

  return order.getOrder();
}

export function calculateOrderCouponDiscount(
  orderId: OrderId,
  couponCodes: CouponCode[],
): CouponDiscountResult {
  const currentDate = new Date();

  const order = findOrder(orderId);
  const selectedCoupons = findCoupons(couponCodes);

  return {
    discountAmount: calculateSelectedDiscountAmount(
      order,
      selectedCoupons,
      currentDate,
    ),
  };
}

export function updateOrderCoupons(
  orderId: OrderId,
  couponCodes: CouponCode[],
) {
  const currentDate = new Date();
  const order = findOrder(orderId);
  const selectedCoupons = findCoupons(couponCodes);

  applySelectedCouponsToOrder(order, selectedCoupons, currentDate);
  order.confirmCouponSelection();

  return order.getOrder();
}

export function updateOrderRemoteArea(orderId: OrderId, isRemoteArea: boolean) {
  const currentDate = new Date();
  const order = findOrder(orderId);

  order.setRemoteArea(isRemoteArea);

  if (order.hasConfirmedCouponSelection()) {
    return order.getOrder();
  }

  applyBestAvailableCouponsToOrder(order, currentDate);

  return order.getOrder();
}
