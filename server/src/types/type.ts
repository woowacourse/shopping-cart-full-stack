export type ProductData = {
  name: string;
  price: number;
  image?: string | null;
};

export type ProductId = string;
export type Quantity = number;

export type ShoppingCartData = {
  productId: ProductId;
  quantity: Quantity;
};

export type CouponType = "FIXED5000" | "BOGO" | "FREESHIPPING" | "MIRACLESALE";

/** 금액 계산에 필요한 최소 상품 정보 (단가 x 수량) */
export type CalculationItem = {
  price: number;
  quantity: Quantity;
};
