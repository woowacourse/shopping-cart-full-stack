export interface OrderProduct {
  id: number;
  quantity: number;
}

export interface PostOrderRequest {
  products: OrderProduct[];
}

export interface PostOrderResponse {
  orderId: number;
}

export interface OrderProductDetail {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
  quantity: number;
  hasGift: boolean;
}

export interface GetOrderResponse {
  products: OrderProductDetail[];
  coupons: number[];
  isRemoteArea: boolean;
  deliveryFee?: number;
}

export interface PatchOrderRequest {
  couponId?: number[];
  isRemoteArea?: boolean;
}

export interface PatchOrderResponse {
  couponId?: number[];
  isRemoteArea?: boolean;
  deliveryFee?: number;
}

export interface GetDiscountRequest {
  couponId?: number[];
}

export interface GetDiscountResponse {
  discountAmount: number;
}

export interface Coupon {
  id: number;
  name: string;
  expirationDate: string;
  minOrderAmount?: number;
  availableHours?: string;
  isCouponUsable: boolean;
}

export interface GetCouponsResponse {
  coupons: Coupon[];
}
