import { z } from "../../shared/schema";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string(),
});

export const cartItemSchema = z.object({
  id: z.string(),
  product: productSchema,
  quantity: z.number(),
});

export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
