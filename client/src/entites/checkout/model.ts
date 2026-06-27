export type Summary = {
  orderPrice: number;
  discountPrice: number;
  deliveryPrice: number;
  totalPrice: number;
};

export type CartItem = {
  id: string;
  product: {
    name: string;
    price: number;
    thumbnail: string;
  };
  quantity: number;
};

export type CheckoutItem = CartItem & { giftQuantity: number };

export type Discount = { type: "RATE"; rate: number } | { type: "FIXED"; amount: number };

export type Rule =
  | { type: "LOW_PRICE"; price: number }
  | { type: "TIME"; startAt: string; endAt: string };

export type Coupon = {
  id: string;
  name: string;
  expirationDate: string;
  rule?: Rule;
  status: {
    type: "UNUSABLE" | "USABLE";
    message: string;
    apply: boolean;
  };
  discount: Discount;
};

export type Gift = {
  productId: string;
  quantity: number;
};

export type OrderResult = {
  items: CartItem[];
  gifts: Gift[];
  totalPrice: number;
};

export type Checkout = {
  priceSummary: Summary;
  selectedItems: CartItem[];
  couponsInfo: Coupon[];
  bestCoupons: string[];
  gifts: Gift[];
};
