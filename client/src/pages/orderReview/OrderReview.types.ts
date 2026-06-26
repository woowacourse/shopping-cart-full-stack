export interface OrderSheetProduct {
  id: number;
  quantity: number;
  name: string;
  price: number;
  imgUrl: string;
}

export type IsRemoteArea = boolean;

export interface Pricing {
  orderSheetAmount: number;
  discountAmount: number;
  shippingFee: number;
  paymentAmount: number;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  expirationDate: string;
  minOrderAmount?: number;
  validTime?: { start: string; end: string };
}

export type AbleCoupon = number;
export type SelectedCoupon = number;
