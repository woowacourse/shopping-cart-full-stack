import { AppError } from "@/errors/AppError";

interface UpdateCartQuantity {
  quantity: number;
}

export const checkIsID = (arg: unknown): arg is string => {
  if (!!arg && typeof arg === "string" && /^\d+$/.test(arg)) return true;

  return false;
};

export const validateID = (arg: unknown): number => {
  if (!checkIsID(arg)) throw new AppError("INVALID_ID");

  return Number(arg);
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
    throw new AppError("INVALID_CARTS_QUANTITY");

  return arg;
};
