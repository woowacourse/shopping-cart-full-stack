export interface ProductData {
  productId: number;
  name: string;
  price: number;
  thumbnailUrl: string;
  totalQuantity: number;
}

export type ProductInput = Omit<ProductData, 'productId'>;

export const validateProductData = (data: ProductInput): void => {
  if (data.totalQuantity < 1 || data.totalQuantity > 99) {
    throw new Error("quantity는 1~99 사이어야합니다.");
  }
  if (data.name.length > 100) {
    throw new Error("name은 100자 이내여야합니다.");
  }
  if (data.price <= 0) {
    throw new Error("price는 0보다 큰 숫자이어야합니다.");
  }
  if (!data.name) {
    throw new Error("name은 필수 항목입니다.");
  }
  if (!data.thumbnailUrl) {
    throw new Error("thumbnailUrl은 필수 항목입니다.");
  }
};
