import { AppError } from "@/errors/AppError";

export const validateCartQuantity = (quantity: number) => {
  if (quantity < 1 || quantity > 99)
    throw new AppError("OUT_OF_RANGE_CARTS_QUANTITY");
};
