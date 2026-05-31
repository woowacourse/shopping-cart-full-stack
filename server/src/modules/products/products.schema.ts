import ERROR_CODES from "../../ERROR_CODE";

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
    Number.isInteger(arg.price) &&
    typeof arg.image === "string"
  ) {
    return true;
  }

  return false;
};

export const validateProduct = (arg: unknown) => {
  if (!checkIsProduct(arg)) throw new Error(ERROR_CODES.INVALID_PRODUCT.code);

  return arg;
};

export const checkIsID = (arg: unknown): arg is string => {
  if (!!arg && typeof arg === "string" && /^\d+$/.test(arg)) return true;

  return false;
};

export const validateID = (arg: unknown): number => {
  if (!checkIsID(arg)) throw new Error(ERROR_CODES.INVALID_ID.code);

  return Number(arg);
};
