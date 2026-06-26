import type { Coupon } from "./coupon";

export interface CheckoutItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Checkout {
  checkoutId: number;
  items: CheckoutItem[];
  coupons: Coupon[];
  remoteArea: boolean;
  checkoutAmount: number;
  couponDiscount: number;
  shippingFee: number;
  totalAmount: number;
}

export interface PaymentSummary {
  itemCount: number;
  totalQuantity: number;
  totalAmount: number;
}
