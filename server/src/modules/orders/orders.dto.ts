export interface OrderProduct {
  id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  products: OrderProduct[];
}

export interface OrderProductResponse {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
  quantity: number;
  hasGift: boolean;
}

export interface GetOrderResponse {
  products: OrderProductResponse[];
  coupons: number[];
  isRemoteArea: boolean;
  deliveryFee?: number;
}

export interface UpdateOrderRequest {
  couponId?: number[];
  isRemoteArea?: boolean;
}

export interface DiscountResponse {
  discountAmount: number;
}

export interface CouponResponse {
  id: number;
  name: string;
  expirationDate: string;
  minOrderAmount?: number;
  availableHours?: string;
  isCouponUsable: boolean;
}

export interface CouponListResponse {
  coupons: CouponResponse[];
}
