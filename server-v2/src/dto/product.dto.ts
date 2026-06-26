import type { SuccessResponse, FailResponse, FieldError } from '../response.js';
import type { Product } from '../models/Product.js';

/**
 * 상품(Product) API 요청/응답 DTO
 * @see docs/STEP3/API.md
 */

/* ------------------------------------------------------------------------ */
/* GET /products - 상품 목록 조회                                            */
/* ------------------------------------------------------------------------ */

export type GetProductsResponse = SuccessResponse<{ products: Product[] }>;

/* ------------------------------------------------------------------------ */
/* POST /products - 상품 추가                                                */
/* ------------------------------------------------------------------------ */

export interface CreateProductRequestBody {
    name: string;
    price: number;
    imgUrl: string;
}

export type CreateProductResponse = SuccessResponse<Product>;

// 400 - 필수 필드 누락
export type CreateProductMissingFieldErrorResponse = FailResponse<FieldError[]>;

// 400 - 필드 값이 도메인 유효성 조건을 벗어남 (예: price <= 0 등)
export type CreateProductInvalidErrorResponse = FailResponse<FieldError[]>;

// 400 - 필드 타입 불일치
export type CreateProductTypeMismatchErrorResponse = FailResponse<undefined>;

// 400 - 요청 body가 JSON 형태가 아님
export type CreateProductNoJsonErrorResponse = FailResponse<undefined>;

/* ------------------------------------------------------------------------ */
/* DELETE /products/:productId - 상품 삭제                                   */
/* ------------------------------------------------------------------------ */

export interface DeleteProductRequestParams {
    productId: string;
}

export type DeleteProductResponse = SuccessResponse<Pick<Product, 'id'>>;

// 404 - productId가 누락됨
export type DeleteProductMissingParamErrorResponse = FailResponse<undefined>;

// 404 - 존재하지 않는 productId
export type DeleteProductNotFoundResponse = FailResponse<undefined>;
