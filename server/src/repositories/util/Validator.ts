import { ProductInput } from "../Product";

export const validateQuantity = (quantity: number): void => {
  if (quantity < 1 || quantity > 99)
    throw new Error("quantity는 1~99 사이어야합니다.");
};

export const validateProductData = (data: ProductInput): void => {
  validateQuantity(data.totalQuantity);
  if (data.name.length > 100) throw new Error("name은 100자 이내여야합니다.");
  if (data.price <= 0) throw new Error("price는 0보다 큰 숫자이어야합니다.");
  if (!data.name) throw new Error("name은 필수 항목입니다.");
  if (!data.thumbnailUrl) throw new Error("thumbnailUrl은 필수 항목입니다.");
};
