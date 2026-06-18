import { InvalidError, NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { cartRepository } from "../repositories/CartRepository";
import { couponRepository } from "../repositories/CouponRepository";
import { productRepository } from "../repositories/ProductRepository";
import { StoredOrder } from "../repositories/StoredOrder";
import { storedOrderRepository } from "../repositories/StoredOrderRepository";
import { isMiracleSaleAvailable } from "./CouponService";

function getOrderOrThrow(orderId: number) {
  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ORDER", ERROR_MESSAGE.NOT_FOUND_ORDER);
  return order;
}

export const getOrdersService = (orderId: number): StoredOrder => {
  return getOrderOrThrow(orderId);
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
  getOrderOrThrow(orderId);
  storedOrderRepository.updateRemoteArea(orderId, remoteArea);
};

export const updateApplyCouponService = (
  orderId: number,
  couponIds: number[],
): void => {
  getOrderOrThrow(orderId);
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

  getOrderOrThrow(orderId);

  storedOrderRepository.deleteById(orderId);
};

// 결제하기 버튼 누르면 결제 확인 페이지에 결제한 상품 종류, 결제한 상품 총 개수, 최종 결제금액을 보내준다.
export const postPaymentService = (orderId: number) => {
  if (!orderId)
    throw new InvalidError("INVALID_ORDER_ID", ERROR_MESSAGE.INVALID_ORDER_ID);
  const order = getOrderOrThrow(orderId);
  if (order.appliedCoupon.includes(4) && !isMiracleSaleAvailable()) {
    throw new InvalidError("INVALID_COUPON", ERROR_MESSAGE.INVALID_COUPON);
  }
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
    totalAmount:
      order.orderAmount - order.couponDiscountAmount + order.shippingFee,
  };
};

// 100,000원 이상 구매시 5000원 할인 함수
export const fixed5000Service = (orderId: number) => {
  const order = getOrderOrThrow(orderId);
  if (order.appliedCoupon.includes(1)) {
    if (Number(order.orderAmount) >= 100000) {
      order.couponDiscountAmount += 5000;
    }
  }
};

//BTGO
// BTGO쿠폰이 적용 쿠폰에 들어있다면,
// 수량 3개인 상품들 productId 싹 담고,
// 그 상품들 productId로 price 뽑아내서 배열에 담고,
//
export const btgoService = (orderId: number) => {
  const order = getOrderOrThrow(orderId);

  if (!order.appliedCoupon.includes(2)) return;

  const over3Items = order.items.filter((item) => item.quantity >= 3);
  if (over3Items.length === 0) return;

  const prices = over3Items.map(
    (item) => productRepository.findById(item.productId)?.price ?? 0,
  );

  order.couponDiscountAmount += Math.max(...prices);
};

//배송비 면제 함수
// 작동 조건
// 1. 주문금액이 10만원 이상
// 2. FREESHIPPING 쿠폰을 사용하였을 때
// remoteArea가 true면 -6000 / remoteArea가 false면 -3000

export const freeShippingService = (orderId: number) => {
  const order = getOrderOrThrow(orderId);
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

//MIRACLESALE
// 항상 FIXED5000 | FREESHIPPING 를 먼저 적용하고 적용한다. <- 이건 여기서 할게 아닌듯
// 적용할 정액 쿠폰으로 할인된 가격에서 30% 할인
export const miracleSaleService = (
  orderId: number,
  discountedAmount: number,
) => {
  const order = getOrderOrThrow(orderId);
  if (order.appliedCoupon.includes(4)) {
    order.couponDiscountAmount += discountedAmount * 0.3;
  }
};
