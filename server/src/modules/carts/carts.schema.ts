import ERROR_CODES from "@/ERROR_CODE";
import createAppError from "@/errors/AppError";

interface UpdateCartQuantity {
  quantity: number;
}

export const checkIsID = (arg: unknown): arg is string => {
  if (!!arg && typeof arg === "string") return true;

  return false;
};

export const validateID = (arg: unknown) => {
  if (!checkIsID(arg)) throw createAppError(ERROR_CODES.INVALID_ID);

  return arg;
};

export const checkIsCartQuantity = (
  arg: unknown,
): arg is UpdateCartQuantity => {
  if (
    !!arg &&
    typeof arg === "object" &&
    "quantity" in arg &&
    typeof arg.quantity === "number"
  ) {
    return true;
  }

  return false;
};

export const validateQuantity = (arg: unknown) => {
  if (!checkIsCartQuantity(arg))
    throw createAppError(ERROR_CODES.INVALID_CARTS_QUANTITY);

  return arg;
};
