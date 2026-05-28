import ERROR_CODES from "@/ERROR_CODE";

export const validateCartQuantity = (quantity: number) => {
  if (quantity < 1 || quantity > 99)
    throw new Error(ERROR_CODES.OUT_OF_RANGE_CARTS_QUANTITY.code);
};
