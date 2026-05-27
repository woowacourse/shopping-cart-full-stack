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
  if (!checkIsProduct(arg)) throw new Error("올바른 데이터가 아닙니다.");

  return arg;
};
