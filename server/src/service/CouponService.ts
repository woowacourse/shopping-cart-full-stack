import { NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { Coupon } from "../repositories/Coupon";
import { couponRepository } from "../repositories/CouponRepository";
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
