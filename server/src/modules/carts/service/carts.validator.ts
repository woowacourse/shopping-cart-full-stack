import ERROR_CODES from "@/ERROR_CODE";
import createAppError from "@/errors/AppError";

export const validateCartQuantity = (quantity: number) => {
  if (quantity < 1 || quantity > 99)
    throw createAppError(ERROR_CODES.OUT_OF_RANGE_CARTS_QUANTITY);
};
