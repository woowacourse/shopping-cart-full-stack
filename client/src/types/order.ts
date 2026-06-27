export interface OrderProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderCoupon {
  id: number;
  title: string;
  discountType: string;
  discountValue: number;
}

export interface CouponItem {
  id: number;
  code: string;
  title: string;
  discountType: "fixed" | "buyXgetY" | "freeShipping" | "percentage";
  discountValue: number;
  minimumAmount?: number;
  expirationDate: string;
  availableTime?: { start: string; end: string };
  isCouponUsable: boolean;
}

export interface OrderDetail {
  products: OrderProduct[];
  coupons: OrderCoupon[];
  isRemoteArea: boolean;
  deliveryFee: number;
  orderAmount: number;
  couponDiscount: number;
  shippingDiscount: number;
  totalAmount: number;
}
