export interface CreateCheckoutRequest {
  items: { product_id: number; quantity: number }[];
}

export interface CreateCheckoutResponse {
  checkout_id: number;
}

export interface CheckoutItemResponse {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface CouponResponse {
  coupon_id: number;
  name: string;
  expired_date?: string;
  min_order_amount?: number;
  usable_start_at?: string;
  usable_end_at?: string;
  is_selected: boolean;
  disabled: boolean;
}

export interface GetCheckoutResponse {
  checkout_id: number;
  items: CheckoutItemResponse[];
  coupons: CouponResponse[];
  remote_area: boolean;
  checkout_amount: number;
  coupon_discount: number;
  shipping_fee: number;
  total_amount: number;
}

export interface UpdateAddressRequest {
  remote_area: boolean;
}

export interface UpdateCouponsRequest {
  coupons: number[] | null;
}

export interface DiscountPreviewResponse {
  coupon_discount: number;
}

export interface PaymentRequest {
  remote_area: boolean;
  coupons: number[] | null;
}

export interface PaymentResponse {
  item_count: number;
  total_quantity: number;
  total_amount: number;
}
