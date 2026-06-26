import type { SuccessResponse, FailResponse, FieldError } from '../response.js';
import type { Product } from '../models/Product.js';
import type { CartPayInfo } from './cart.dto.js';

/**
 * 주문 확인(Order Check) API 요청/응답 DTO
 * @see docs/STEP3/API.md
 */

/* ------------------------------------------------------------------------ */
/* POST /order-check - 주문 확인 생성                                        */
/* ------------------------------------------------------------------------ */

// Request Body 없음. 인증 헤더로 식별한 사용자의 cartId를 서버가 직접 판단해 주문을 생성한다
// (클라이언트가 productId/cartItemId 목록을 보내지 않기로 결정 — 선택 상태의 원천을 서버(DB) 하나로 유지).
export type CreateOrderCheckResponse = SuccessResponse<{ products: OrderCheckProduct[] }>;

/* ------------------------------------------------------------------------ */
/* GET /order-check - 주문 확인 상품 조회                                     */
/* ------------------------------------------------------------------------ */

export type OrderCheckProduct = Product & {
    quantity: number;
};

// 상품 목록과 결제 정보를 한 번에 내려준다 (주문 확인 화면에서 항상 함께 쓰여 별도 요청을 줄임).
export type GetOrderCheckResponse = SuccessResponse<{
    products: OrderCheckProduct[];
    payInfo: OrderCheckPayInfo;
}>;

/* ------------------------------------------------------------------------ */
/* GET /order-check/pay-info - 주문 확인 결제 정보 조회                       */
/* ------------------------------------------------------------------------ */

// CartPayInfo(orderPrice/deliveryFee/totalOrderAmount)에 쿠폰 할인 정보를 추가한다.
// deliveryFee는 무료배송 쿠폰까지 반영된 최종 배송비다.
// couponDiscountAmount는 주문 금액(상품 금액)에 적용된 쿠폰 할인 합이다.
export interface OrderCheckPayInfo extends CartPayInfo {
    couponDiscountAmount: number;
}

export type GetOrderCheckPayInfoResponse = SuccessResponse<OrderCheckPayInfo>;

// 404 - 해당 유저의 장바구니로 만들어진 order table이 없을 때
export type GetOrderCheckPayInfoNotFoundResponse = FailResponse<undefined>;

/* ------------------------------------------------------------------------ */
/* PATCH /order-check/select/remote-areas - 도서 산간 지역 선택               */
/* ------------------------------------------------------------------------ */

export interface SelectRemoteAreaRequestBody {
    checkStatus: boolean;
}

export type SelectRemoteAreaResponse = SuccessResponse<{ checkStatus: boolean }>;

// 400 - checkStatus가 누락됨
export type SelectRemoteAreaMissingFieldErrorResponse = FailResponse<FieldError[]>;

// 404 - 해당 유저의 장바구니로 만들어진 order table이 없을 때
export type SelectRemoteAreaNotFoundErrorResponse = FailResponse<undefined>;
