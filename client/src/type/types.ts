export interface CartItem {
  cartItemId: number;
  quantity: number;
  productId: number;
  productData: {
    productId: number;
    name: string;
    price: number;
    thumbnailUrl: string;
    totalQuantity: number;
  };
}

export interface OrderItem {
  productId: number;
  quantity: number;
  productData: {
    productId: number;
    name: string;
    price: number;
    thumbnailUrl: string;
    totalQuantity: number;
  };
}

export interface OrderData {
  orderId: number;
  items: OrderItem[];
  appliedCoupon: number[];
  remoteArea: boolean; //제주도, 도서산간 지역
  orderAmount: number;
  couponDiscountAmount: number;
  shippingFee: number;
  totalAmount: number;
  couponCombinations: Record<string, number>;
}

export interface CouponData {
  couponId: number;
  couponCode: string; // 'FIXED5000' | 'BTGO' | 'FREESHIPPING' | 'MIRACLESALE'
  expiredDate: string;
  minOrderAmount?: number;
  usableStartAt?: string | null;
  usableEndAt?: string | null;
  discountAmount?: number;
  discountRate?: number;
  isAvailable?: boolean;
}
