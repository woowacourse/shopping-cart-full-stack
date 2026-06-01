import * as z from 'zod';

export const InsertProductRequestBodySchema = z.object({
  name: z.string({
    error: (iss) =>
      iss.received === 'undefined' ? '상품명은 필수입니다.' : '상품명은 문자열이어야 합니다.',
  }),
  price: z.number({
    error: (iss) =>
      iss.received === 'undefined' ? '가격은 필수입니다.' : '가격은 숫자여야 합니다.',
  }),
  image: z.string({
    error: (iss) =>
      iss.received === 'undefined'
        ? '상품 이미지는 필수입니다.'
        : '상품 이미지는 문자열이어야 합니다.',
  }),

  stock: z.number({
    error: (iss) =>
      iss.received === 'undefined' ? '재고는 필수입니다.' : '재고는 숫자여야 합니다.',
  }),
});

export const DeleteProductRequestParamsSchema = z.object({
  productId: z.string({
    error: (iss) =>
      iss.received === 'undefined' ? '상품 ID는 필수입니다.' : '상품 ID는 문자열이어야 합니다.',
  }),
});

export const InsertCartItemBodySchema = z.object({
  productId: z.string({
    error: (iss) =>
      iss.received === 'undefined' ? '상품 ID는 필수입니다.' : '상품 ID는 문자열이어야 합니다.',
  }),
  quantity: z.number({
    error: (iss) =>
      iss.code === 'invalid_type' && iss.received === 'undefined'
        ? '수량은 필수입니다.'
        : '수량은 1 이상 99 이하의 정수여야 합니다.',
  }),
});

export const UpdateCartItemRequestParamsSchema = z.object({
  cartItemId: z.string({
    error: (iss) =>
      iss.received === 'undefined'
        ? '장바구니 상품 ID는 필수입니다.'
        : '장바구니 상품 ID는 문자열이어야 합니다.',
  }),
});

export const UpdateCartItemRequestBodySchema = z.object({
  quantity: z.number({
    error: (iss) =>
      iss.code === 'invalid_type' && iss.received === 'undefined'
        ? '수량은 필수입니다.'
        : '수량은 1 이상 99 이하의 정수여야 합니다.',
  }),
});

export const DeleteCartItemRequestParamsSchema = UpdateCartItemRequestParamsSchema;

