import type { SuccessResponse, FailResponse, FieldError } from '../response.js';

/**
 * 쿠폰(Coupon) API 요청/응답 DTO
 * @see docs/STEP3/API.md
 */

export type CouponDescription =
  | { type: 'EXPIRY_DATE'; content: { expiresAt: string } }
  | { type: 'MIN_ORDER_AMOUNT'; content: { minAmount: number } }
  | { type: 'USABLE_TIME'; content: { from: string; to: string } }
  | { type: 'MIN_QUANTITY_PER_PRODUCT'; content: { minQuantity: number } };

export interface Coupon {
  couponId: string;
  couponTitle: string;
  disabled: boolean;

  description: CouponDescription[];
}

/* ------------------------------------------------------------------------ */
/* GET /order-check/coupons - 쿠폰 정보 조회                                 */
/* ------------------------------------------------------------------------ */

export type GetOrderCheckCouponsResponse = SuccessResponse<{
  coupons: Coupon[];
  selectedCoupons: string[];
}>;

/* ------------------------------------------------------------------------ */
/* PATCH /order-check/coupons - 쿠폰 적용                                    */
/* ------------------------------------------------------------------------ */

export interface SelectCouponsRequestBody {
  selectedCouponId: string[];
}

// 204 No Content - 정상 적용 (응답 본문 없음)

// 400 - 배열의 길이가 2를 초과함
export type SelectCouponsInvalidCountErrorResponse = FailResponse<{
  errorCode: 'INVALID_COUPON_COUNT';
}>;

// 400 - selectedCouponId가 누락됨
export type SelectCouponsMissingFieldErrorResponse = FailResponse<FieldError[]>;

/* ------------------------------------------------------------------------ */
/* POST /order-check/coupons - 선택된 쿠폰 기반 할인액 계산                   */
/* ------------------------------------------------------------------------ */

// PATCH와 동일한 body. 선택을 저장하지 않고, 그 조합을 적용했을 때의 할인액만 계산해서 돌려준다
// (정액 쿠폰 적용 후 정률 쿠폰을 나머지 금액에 적용하는 순서 규칙이 있어, 조합별 사전 계산이 불가능해 도입함).
export type CalculateCouponDiscountRequestBody = SelectCouponsRequestBody;

// 200
export type CalculateCouponDiscountResponse = SuccessResponse<{
  discountAmount: number;
}>;
// 400 - selectedCouponId가 누락됨
export type CalculateCouponDiscountMissingFieldErrorResponse = FailResponse<FieldError[]>;
