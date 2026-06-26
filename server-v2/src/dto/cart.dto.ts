import type { SuccessResponse, FailResponse, FieldError } from '../response.js';
import type { CartItem } from '../models/CartItem.js';

/**
 * 장바구니(Cart) API 요청/응답 DTO
 * @see docs/STEP3/API.md
 */

export interface Cart {
    isAllSelected: boolean;
    cartItems: CartItem[];
}

export interface CartPayInfo {
    orderPrice: number;
    deliveryFee: number;
    totalOrderAmount: number;
}

/* ------------------------------------------------------------------------ */
/* GET /cart - 장바구니 상품 조회                                            */
/* ------------------------------------------------------------------------ */

// 상품 목록과 결제 정보를 한 번에 내려준다 (장바구니 화면에서 항상 함께 쓰여 별도 요청을 줄임).
export interface CartWithPayInfo extends Cart {
    payInfo: CartPayInfo;
}

export type GetCartResponse = SuccessResponse<CartWithPayInfo>;

/* ------------------------------------------------------------------------ */
/* POST /cart - 장바구니 상품 추가                                           */
/* ------------------------------------------------------------------------ */

export interface AddCartItemRequestBody {
    productId: string;
    quantity: number;
}

export type AddCartItemResponse = SuccessResponse<CartItem>;

export type AddCartItemMissingFieldErrorResponse = FailResponse<FieldError[]>;

export type AddCartItemTypeMismatchErrorResponse = FailResponse<undefined>;

export type AddCartItemInvalidErrorResponse = FailResponse<FieldError[]>;

export type AddCartItemNotFoundResponse = FailResponse<undefined>;

/* ------------------------------------------------------------------------ */
/* GET /cart/pay-info - 장바구니 결제 정보 조회                              */
/* ------------------------------------------------------------------------ */

export type GetCartPayInfoResponse = SuccessResponse<CartPayInfo>;

/* ------------------------------------------------------------------------ */
/* PATCH /carts/select/product/:productId - 장바구니 단일 상품 선택           */
/* ------------------------------------------------------------------------ */

export interface SelectCartItemRequestParams {
    productId: string;
}

export interface SelectCartItemRequestBody {
    checkStatus: boolean;
}

export type SelectCartItemResponse = SuccessResponse<{
    isAllSelected: boolean;
    cartItem: CartItem;
}>;

// 404 - productId가 누락됨
export type SelectCartItemMissingParamErrorResponse = FailResponse<undefined>;

// 404 - 존재하지 않는 productId
export type SelectCartItemNotFoundResponse = FailResponse<undefined>;

/* ------------------------------------------------------------------------ */
/* PATCH /carts/select - 장바구니 전체 상품 선택                              */
/* ------------------------------------------------------------------------ */

export interface SelectAllCartItemsRequestBody {
    checkStatus: boolean;
}

export type SelectAllCartItemsResponse = SuccessResponse<Cart>;

/* ------------------------------------------------------------------------ */
/* PATCH /carts/products/:productId - 장바구니 상품 수량 변경                 */
/* ------------------------------------------------------------------------ */

export interface UpdateCartItemQuantityRequestParams {
    productId: string;
}

export interface UpdateCartItemQuantityRequestBody {
    quantity: number;
}

export type UpdateCartItemQuantityResponse = SuccessResponse<CartItem>;

// 400 - quantity가 누락됨
export type UpdateCartItemQuantityMissingFieldErrorResponse = FailResponse<FieldError[]>;

// 400 - quantity 타입 불일치
export type UpdateCartItemQuantityTypeMismatchErrorResponse = FailResponse<undefined>;

// 400 - quantity가 1~99 범위를 벗어남 (도메인 유효성 에러)
export type UpdateCartItemQuantityInvalidErrorResponse = FailResponse<FieldError[]>;

// 400 - 요청 body가 JSON 형태가 아님
export type UpdateCartItemQuantityNoJsonErrorResponse = FailResponse<undefined>;

// 404 - productId가 누락됨
export type UpdateCartItemQuantityMissingParamErrorResponse = FailResponse<undefined>;

// 404 - 존재하지 않는 productId
export type UpdateCartItemQuantityNotFoundResponse = FailResponse<undefined>;

/* ------------------------------------------------------------------------ */
/* DELETE /cart/product/:productId - 장바구니 상품 삭제                       */
/* ------------------------------------------------------------------------ */

export interface DeleteCartItemRequestParams {
    productId: string;
}

export type DeleteCartItemResponse = SuccessResponse<{ deletedProductId: string }>;

// 404 - productId가 누락됨
export type DeleteCartItemMissingParamErrorResponse = FailResponse<undefined>;

// 404 - 존재하지 않는 productId
export type DeleteCartItemNotFoundResponse = FailResponse<undefined>;
