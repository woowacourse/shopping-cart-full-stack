export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
}

export type CouponDiscountType = "percentage" | "fixed" | "buyXgetY" | "freeShipping";

export interface Coupon {
  id: number;
  code: string;
  title: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumAmount?: number;
  expirationDate: string;
  availableTime?: { start: string; end: string };
}

export type CartId = Product["id"];

export interface CartItem {
  product: Product;
  quantity: number;
}
