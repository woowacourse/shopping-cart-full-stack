import * as z from 'zod';

export const InsertProductRequestBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  image: z.string(),
  stock: z.number(),
});

export const DeleteProductRequestParamsSchema = z.object({
  productId: z.string(),
});

export const InsertCartItemBodySchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export const UpdateCartItemRequestParamsSchema = z.object({
  cartItemId: z.string(),
});

export const UpdateCartItemRequestBodySchema = z.object({
  quantity: z.number(),
});

export const DeleteCartItemRequestParamsSchema = UpdateCartItemRequestParamsSchema;

export const ProductSchema = z.object({
  name: z.string().min(1).max(100),
  image: z.string(),
  price: z.number().int().min(1),
  stock: z.number().int().min(0).max(99),
});

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});
