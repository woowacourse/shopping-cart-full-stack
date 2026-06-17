import { NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { Coupon } from "../repositories/Coupon";
import { couponRepository } from "../repositories/CouponRepository";

// 쿠폰 DB에서 쿠폰 불러오기 get
export const getCouponService = (): Coupon[] => {
  const coupons = couponRepository.findAll();
  if (!coupons)
    throw new NotFoundError("NOT_FOUND_COUPON", ERROR_MESSAGE.NOT_FOUND_COUPON);

  return coupons;
};
// 쿠폰 별 할인액 계산
// 적용할 쿠폰 우선순위 정하기
// 조건에 따른 비활성화 처리 로직 (최소 주문 금액, 만료일, 미라클모닝 조건)에 따른 비활성화 처리 로직

// FREESHIPPING
// 1. 주문금액 100,000원 이상이면 비활성화 (이미 무료 배송)
// 2. 50,000 <= 주문금액 <  100,000 이면 활성화
// remoteArea true면 -6000
// remoteArea false면 -3000

// FIXED5000
// 100,000원 이상 구매시 5000원 할인 적용

// BTGO
// 1. 수량이 3개 이상인 상품이 하나라도 있으면 활성화
// 2. 수량이 3개 이상인 상품중에서 가장 price가 큰 상품에 적용
// 3. 할인액: 해당 상품의 price
// 4. 이 쿠폰은 다른 쿠폰과 동시 적용 X (단독 사용만 가능)

//MIRACLESALE
// 항상 FIXED5000 | FREESHIPPING 를 먼저 적용하고 적용한다.
// 적용할 정액 쿠폰으로 할인된 가격에서 30% 할인
