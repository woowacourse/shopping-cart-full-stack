import { NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { Coupon } from "../repositories/Coupon";
import { couponRepository } from "../repositories/CouponRepository";
import { productRepository } from "../repositories/ProductRepository";
import { storedOrderRepository } from "../repositories/StoredOrderRepository";
import {
  btgoService,
  fixed5000Service,
  freeShippingService,
  miracleSaleService,
} from "./OrderService";

// 쿠폰 DB에서 쿠폰 불러오기 get
export const getCouponService = (): Coupon[] => {
  const coupons = couponRepository.findAll();
  if (!coupons)
    throw new NotFoundError("NOT_FOUND_COUPON", ERROR_MESSAGE.NOT_FOUND_COUPON);

  return coupons;
};

// 쿠폰 별 할인액 계산
// 적용할 쿠폰 우선순위 정하기
// 주문금액을 받아와서 조건에 부합하는 쿠폰들로 적용한 할인액을 비교
// MIRACLESALE은 항상 FIXED5000, FREESHIPPING 이 먼저 적용된 가격에 적용
// BTGO 는 다른 쿠폰과 함께 사용할 수 없음

// 조건에 따른 쿠폰 비활성화 처리 로직
// 1. FIXED5000
// - 주문금액 < minOrderAmount 면 비활성화
// - 적용 시간이 2026-11-30 이후면 삭제

// 2. BTGO
// - 수량이 3개 이상인 상품이 없으면 비활성화
// - 적용 시간이 2026-06-30 이후면 삭제

// 3. FREESHIPPING
// - 50000 > 주문금액 or  100000 <= 주문금액 이면 비활성화
// - 적용 시간이 2026-08-31 이후면 삭제

// 4. MIRACLESALE
// - GET /order요청을 보냈을 때,
// GET/coupon/:orderId 요청을 보낼 때,
// 결제하기 요청을 보낼 때의 클라이언트의 현재 시간이 04:00~07:00 사이가 아니라면 비활성화 및 적용 불가
// - 적용 시간이 2026-07-31 이후면 삭제

// 만료일 검증
const isExpired = (expiredDate: string): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return today > expiredDate;
};

// 결제하기 요청을 보낼 때의 클라이언트의 현재 시간이 04:00~07:00 사이가 아니라면 비활성화 및 적용 불가
const isInMiracleSaleHours = (): boolean => {
  const now = new Date();
  return now.getHours() >= 4 && now.getHours() < 7;
};

//1. FIXED5000
// - 주문금액 < minOrderAmount 면 비활성화
// - 적용 시간이 2026-11-30 이후면 삭제
export const isFixed5000Available = (orderId: number): boolean => {
  const order = storedOrderRepository.findById(orderId);
  const coupon = couponRepository.findById(1);
  if (!order || !coupon) return false;
  if (isExpired(coupon.expiredDate)) return false;
  return Number(order.orderAmount) >= coupon.minOrderAmount!;
};

// 2. BTGO
// - 수량이 3개 이상인 상품이 없으면 비활성화
// - 적용 시간이 2026-06-30 이후면 삭제
export const isBtgoAvailable = (orderId: number): boolean => {
  const order = storedOrderRepository.findById(orderId);
  const coupon = couponRepository.findById(2);
  if (!order || !coupon) return false;
  if (isExpired(coupon.expiredDate)) return false;
  return order.items.some((item) => item.quantity >= 3);
};

// 3. FREESHIPPING
// - 50000 > 주문금액 or  100000 <= 주문금액 이면 비활성화
// - 적용 시간이 2026-08-31 이후면 삭제
export const isFreeShippingAvailable = (orderId: number): boolean => {
  const order = storedOrderRepository.findById(orderId);
  const coupon = couponRepository.findById(3);
  if (!order || !coupon) return false;
  if (isExpired(coupon.expiredDate)) return false;
  const amount = Number(order.orderAmount);
  return amount >= 50000 && amount < 100000;
};

// 4. MIRACLESALE
// - GET /order요청을 보냈을 때,
// GET/coupon/:orderId 요청을 보낼 때,
// 결제하기 요청을 보낼 때의 클라이언트의 현재 시간이 04:00~07:00 사이가 아니라면 비활성화 및 적용 불가
// - 적용 시간이 2026-07-31 이후면 삭제
export const isMiracleSaleAvailable = (): boolean => {
  const coupon = couponRepository.findById(4);
  if (!coupon) return false;
  if (isExpired(coupon.expiredDate)) return false;
  return isInMiracleSaleHours();
};

// 적용 가능한 쿠폰 좁히기
const getAvailableCouponIds = (orderId: number): number[] => {
  const available: number[] = [];
  if (isFixed5000Available(orderId)) available.push(1);
  if (isBtgoAvailable(orderId)) available.push(2);
  if (isFreeShippingAvailable(orderId)) available.push(3);
  if (isMiracleSaleAvailable()) available.push(4);
  return available;
};

//가능한 모든 쿠폰 조합 생성(BTGO는 단독, 나머지 쿠폰 조합 생성)
const getValidCombinations = (availableIds: number[]): number[][] => {
  const combinations: number[][] = [];
  const nonBtgo = availableIds.filter((id) => id !== 2);

  if (availableIds.includes(2)) combinations.push([2]);

  nonBtgo.forEach((id) => combinations.push([id]));

  for (let i = 0; i < nonBtgo.length; i++) {
    for (let j = i + 1; j < nonBtgo.length; j++) {
      combinations.push([nonBtgo[i], nonBtgo[j]]);
    }
  }

  return combinations;
};

// 어떤 조합이 최대 할인인지 비교하기 위한 계산 로직
const calculateDiscount = (orderId: number, couponIds: number[]): number => {
  const order = storedOrderRepository.findById(orderId)!;
  const orderAmount = Number(order.orderAmount);
  let couponDiscount = 0;
  let shippingDiscount = 0;

  //BTGO
  if (couponIds.includes(2)) {
    const prices = order.items
      .filter((item) => item.quantity >= 3)
      .map((item) => productRepository.findById(item.productId)?.price!);
    return prices.length > 0 ? Math.max(...prices) : 0;
  }

  //FIXED5000
  if (couponIds.includes(1)) couponDiscount += 5000;

  //FREESHIPPING
  if (couponIds.includes(3) || orderAmount >= 100000) {
    shippingDiscount = order.remoteArea ? 6000 : 3000;
  }

  //MIRACLESALE
  if (couponIds.includes(4)) {
    couponDiscount += (orderAmount - couponDiscount) * 0.3;
  }

  return couponDiscount + shippingDiscount;
};

// 최적 쿠폰 조합 자동 계산 및 적용 메서드
export const applyCouponsService = (orderId: number): void => {
  const order = storedOrderRepository.findById(orderId);
  if (!order)
    throw new NotFoundError("NOT_FOUND_ORDER", ERROR_MESSAGE.NOT_FOUND_ORDER);

  const availableIds = getAvailableCouponIds(orderId);
  const combinations = getValidCombinations(availableIds);

  const bestCombination = combinations.reduce(
    (best, current) =>
      calculateDiscount(orderId, current) > calculateDiscount(orderId, best)
        ? current
        : best,
    combinations[0] ?? [],
  );

  storedOrderRepository.updateAppliedCoupon(orderId, bestCombination);

  if (bestCombination.includes(2)) {
    btgoService(orderId);
    return;
  }

  if (bestCombination.includes(1)) fixed5000Service(orderId);
  freeShippingService(orderId);

  if (bestCombination.includes(4)) {
    const freshOrder = storedOrderRepository.findById(orderId)!;
    const discountedAmount =
      Number(freshOrder.orderAmount) - freshOrder.couponDiscountAmount;
    miracleSaleService(orderId, discountedAmount);
  }
};
