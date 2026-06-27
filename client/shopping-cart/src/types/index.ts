export type Product = {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  checkStatus: boolean;
};

export type PayInfo = {
  orderPrice: number;
  deliveryFee: number;
  couponDiscountAmount: number;
  totalOrderAmount: number;
};

export type Cart = {
  isAllSelected: boolean;
  cartItems: CartItem[];
  payInfo: Omit<PayInfo, 'couponDiscountAmount'>;
};

export type OrderCheckProduct = Product & { quantity: number };

export type OrderCheck = {
  products: OrderCheckProduct[];
  payInfo: PayInfo;
};

export type CouponDescription =
  | { type: 'EXPIRY_DATE'; content: { expiresAt: string } }
  | { type: 'MIN_ORDER_AMOUNT'; content: { minAmount: number } }
  | { type: 'USABLE_TIME'; content: { from: string; to: string } }
  | { type: 'MIN_QUANTITY_PER_PRODUCT'; content: { minQuantity: number } };

export type Coupon = {
  couponId: string;
  couponTitle: string;
  disabled: boolean;
  description: CouponDescription[];
};

export type CouponInfo = {
  coupons: Coupon[];
  selectedCoupons: string[];
};

export type FetchCart = () => Promise<Cart>;
export type UpdateCartQuantity = (productId: string, quantity: number) => Promise<CartItem>;
export type DeleteCartItem = (productId: string) => Promise<unknown>;
