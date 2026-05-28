import * as z from 'zod';

export const InsertProductRequestBodySchema = z.object({
  name: z.string({ error: '상품명은 필수입니다.' }),
  price: z.number({
    error: (iss) =>
      iss.code === 'invalid_type' && iss.received === 'undefined'
        ? '가격은 필수입니다.'
        : '가격은 0보다 큰 숫자여야 합니다.',
  }),
  image: z.string({ error: '상품 이미지는 필수입니다.' }),
  stock: z.number({
    error: (iss) =>
      iss.code === 'invalid_type' && iss.received === 'undefined'
        ? '재고는 필수입니다.'
        : '재고는 0 이상 99 이하의 정수여야 합니다.',
  }),
});

export const DeleteProductRequestParamsSchema = z.object({
  productId: z.string(),
});

export const InsertCartItemBodySchema = z.object({
  productId: z.string({ error: '상품 ID는 필수입니다.' }),
  quantity: z.number({
    error: (iss) =>
      iss.code === 'invalid_type' && iss.received === 'undefined'
        ? '수량은 필수입니다.'
        : '수량은 1 이상 99 이하의 정수여야 합니다.',
  }),
});

export const UpdateCartItemRequestParamsSchema = z.object({
  cartItemId: z.string(),
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

export const ProductSchema = z.object({
  name: z
    .string({ error: '상품명은 필수입니다.' })
    .min(1, { error: '상품명은 필수입니다.' })
    .max(100, { error: '상품명은 최대 100자까지 허용됩니다.' }),

  image: z
    .string({ error: '상품 이미지는 필수입니다.' })
    .min(1, { error: '상품 이미지는 필수입니다.' }),

  price: z
    .number({ error: '가격은 0보다 큰 숫자여야 합니다.' })
    .int({ error: '가격은 0보다 큰 숫자여야 합니다.' })
    .min(1, { error: '가격은 0보다 큰 숫자여야 합니다.' }),

  stock: z
    .number({ error: '재고는 0 이상 99 이하의 정수여야 합니다.' })
    .int({ error: '재고는 0 이상 99 이하의 정수여야 합니다.' })
    .min(0, { error: '재고는 0 이상 99 이하의 정수여야 합니다.' })
    .max(99, { error: '재고는 0 이상 99 이하의 정수여야 합니다.' }),
});

export const CartItemSchema = z.object({
  productId: z
    .string({ error: '상품 ID는 필수입니다.' })
    .min(1, { error: '상품 ID는 필수입니다.' }),

  quantity: z
    .number({ error: '수량은 1 이상 99 이하의 정수여야 합니다.' })
    .int({ error: '수량은 1 이상 99 이하의 정수여야 합니다.' })
    .min(1, { error: '수량은 1 이상 99 이하의 정수여야 합니다.' })
    .max(99, { error: '수량은 1 이상 99 이하의 정수여야 합니다.' }),
});
