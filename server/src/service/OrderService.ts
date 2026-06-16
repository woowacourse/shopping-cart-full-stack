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

  // order안에서 순회를 돌려 items의 productId로 해당 상품의 totalQuantity를 가져와서 order의 해당 item의 quantity랑 비교
  // 검증 통과하면 product.totalQuantity -1
  // 적용한 쿠폰의 유효기간이 아직 유효한지, 미라클모닝 쿠폰이 있다면 현재 적용 가능 시간대가 맞는지 검증
  // cartRepository.delete(productId) 장바구니에서 검증 끝난 상품 삭제
  // storedOrderRepository.delete(orderId) 임시 오더 삭제
  //{itemCount, orderQuantity, totalAmount } response body값으로 넘겨준다.
  // if (order?.items.quantity > product?.totalQuantity) throw new Error("재고가 부족합니다.")
};
