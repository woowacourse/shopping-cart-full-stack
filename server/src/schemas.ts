import * as z from 'zod';

export const InsertProductRequestBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  image: z.string(),
  stock: z.number(),
});
