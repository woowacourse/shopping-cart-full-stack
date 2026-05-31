import ERROR_CODES from "../../ERROR_CODE";
import createAppError from "@/errors/AppError";

export interface CreateProductRequest {
  name: string;
  price: number;
  image: string;
}

export const checkIsProduct = (arg: unknown): arg is CreateProductRequest => {
  if (
    !!arg &&
    typeof arg === "object" &&
    "name" in arg &&
    "price" in arg &&
    "image" in arg &&
    typeof arg.name === "string" &&
    typeof arg.price === "number" &&
    typeof arg.image === "string"
  ) {
    return true;
  }

  return false;
};

export const validateProduct = (arg: unknown) => {
  if (!checkIsProduct(arg)) throw createAppError(ERROR_CODES.INVALID_PRODUCT);

  return arg;
};

export const checkIsID = (arg: unknown): arg is string => {
  if (!!arg && typeof arg === "string") return true;

  return false;
};

export const validateID = (arg: unknown) => {
  if (!checkIsID(arg)) throw createAppError(ERROR_CODES.INVALID_ID);

  return arg;
};
