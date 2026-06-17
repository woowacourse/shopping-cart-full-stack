import { InvalidError, NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { cartRepository } from "../repositories/CartRepository";
import { couponRepository } from "../repositories/CouponRepository";
import { productRepository } from "../repositories/ProductRepository";
import { StoredOrder } from "../repositories/StoredOrder";
import { storedOrderRepository } from "../repositories/StoredOrderRepository";

export const getOrdersService = (orderId: number): StoredOrder => {
  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ORDER", ERROR_MESSAGE.NOT_FOUND_ORDER);
  return order;
};

export const postOrderService = (
  newOrder: Omit<StoredOrder, "orderId">,
): StoredOrder => {
  const addedOrder = storedOrderRepository.addOrder(newOrder);
  return addedOrder;
};

export const updateRemoteAreaService = (
  orderId: number,
  remoteArea: boolean,
) => {
  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ERROR", ERROR_MESSAGE.NOT_FOUND_ORDER);
  storedOrderRepository.updateRemoteArea(orderId, remoteArea);
};

export const updateApplyCouponService = (
  orderId: number,
  couponIds: number[],
): void => {
  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ERROR", ERROR_MESSAGE.NOT_FOUND_ORDER);
  couponIds.forEach((id) => {
    if (!couponRepository.findById(id))
      throw new InvalidError(
        "NOT_FOUND_COUPON",
        ERROR_MESSAGE.NOT_FOUND_COUPON,
      );
  });
  storedOrderRepository.updateAppliedCoupon(orderId, couponIds);
};

export const deleteOrderService = (orderId: number): void => {
  if (!orderId)
    throw new InvalidError("INVALID_ORDER_ID", ERROR_MESSAGE.INVALID_ORDER_ID);

  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ORDER", ERROR_MESSAGE.NOT_FOUND_ORDER);

  storedOrderRepository.deleteById(orderId);
};

// 결제하기 버튼 누르면 결제 확인 페이지에 결제한 상품 종류, 결제한 상품 총 개수, 최종 결제금액을 보내준다.
export const postPaymentService = (orderId: number) => {
  if (!orderId)
    throw new InvalidError("INVALID_ORDER_ID", ERROR_MESSAGE.INVALID_ORDER_ID);
  const order = storedOrderRepository.findById(orderId);

  if (!order)
    throw new NotFoundError("NOT_FOUND_ORDER", ERROR_MESSAGE.NOT_FOUND_ORDER);

  order.items.forEach(({ productId, quantity }) => {
    const product = productRepository.findById(productId);
    if (!product)
      throw new NotFoundError(
        "NOT_FOUND_PRODUCT",
        ERROR_MESSAGE.NOT_FOUND_PRODUCT,
      );
    // 재고 / 수량 검증
    if (product.totalQuantity < quantity)
      throw new InvalidError(
        "INVALID_QUANTITY",
        ERROR_MESSAGE.INVALID_QUANTITY,
      );
  });

  order.items.forEach(({ productId, quantity }) => {
    productRepository.decreaseQuantity(productId, quantity);
    cartRepository.deleteByProductId(productId);
  });

  storedOrderRepository.deleteById(orderId);

  return {
    itemCount: order.items.length,
    orderQuantity: order.items.reduce((acc, item) => acc + item.quantity, 0),
    totalAmount: 0, // 쿠폰 계산 로직 구현 후 채우기
  };
};

//배송비 면제 함수
// 작동 조건
// 1. 주문금액이 10만원 이상
// 2. FREESHIPPING 쿠폰을 사용하였을 때
// remoteArea가 true면 -6000 / remoteArea가 false면 -3000

export const freeShipping = (orderId: number) => {
  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ORDER", ERROR_MESSAGE.NOT_FOUND_ORDER);

  const isRemoteArea = () => {
    if (order.remoteArea === true) {
      order.shippingFee = order.shippingFee - 6000;
    }
    if (order.remoteArea === false) {
      order.shippingFee = order.shippingFee - 3000;
    }
  };

  // 주문금액이 100000원 이상
  if (Number(order.orderAmount) >= 100000) {
    isRemoteArea();
  }

  //주문금액이 50000~100000
  if (
    Number(order.orderAmount) >= 50000 &&
    Number(order.orderAmount) < 100000
  ) {
    // FREESHIPING 쿠폰을 사용하였을 때
    if (order.appliedCoupon.includes(3)) {
      isRemoteArea();
    }
  }
};

// 100,000원 이상 구매시 5000원 할인 함수
export const fixed5000 = (orderId: number) => {
  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ORDER", ERROR_MESSAGE.NOT_FOUND_ORDER);
  if (order.appliedCoupon.includes(1)) {
    if (Number(order.orderAmount) >= 100000) {
      order.couponDiscountAmount += 5000;
    }
  }
};
