export interface Coupon {
  id: string; // 아이디
  name: string; // 이름
  expiriationDate: Date; // 만료일
  discountType: DiscountType;
  rule?: LowPrice | Time; // 장바구니 전체를 보는 사용 조건
  itemRule?: ItemRule; // 상품 하나하나를 보고 혜택 대상을 골라내는 조건

  canUse: (args: CouponProps) => CouponStatus;
  execute: (args: CouponProps) => CouponResult;
  discountView: (args: CouponProps) => DiscountView;
}

// 프론트 계산용
export type DiscountView = { type: "RATE"; rate: number } | { type: "FIXED"; amount: number };
export type LowPrice = { type: "LOW_PRICE"; price: number };
export type Time = { type: "TIME"; startAt: string; endAt: string };

export type ItemRule = { type: "MIN_QUANTITY"; minQuantity: number };

export type CouponStatus = {
  type: "USABLE" | "UNUSABLE";
  message: string;
};

export type CheckoutCart = {
  productId: string;
  quantity: number;
  price: number;
};

export type Summary = {
  orderPrice: number;
  discountPrice: number;
  deliveryPrice: number;
  totalPrice: number;
};
export type Gift = {
  productId: string;
  quantity: number;
};

export interface CouponProps {
  checkoutCartList: CheckoutCart[];
  summary: Summary;
  gifts: Gift[];
}
export interface CouponResult {
  checkoutCartList: CheckoutCart[];
  summary: Summary;
  gifts: Gift[];
}

export interface Fixed {
  type: "FIXED";
  discountFixed: number; // 할인금액
}
export interface Bogo {
  type: "BOGO";
  getQuantity: number; // 혜택: 증정 개수 (대상 선별은 itemRule이 담당)
}
export interface FreeShipping {
  type: "FREESHIPPING";
}

export interface MiralceSale {
  type: "MIRACLESALE";
  discountRate: number; // 할인 퍼센트
}

export type DiscountType = Fixed | Bogo | FreeShipping | MiralceSale;
