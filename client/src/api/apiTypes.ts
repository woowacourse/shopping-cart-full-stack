export interface Product {
    id: string;
    name: string;
    price: number;
    imgUrl: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    checkStatus: boolean;
}

export interface Cart {
    isAllSelected: boolean;
    cartItems: CartItem[];
}

export interface CartPayInfo {
    orderPrice: number;
    deliveryFee: number;
    totalOrderAmount: number;
}

export interface CartWithPayInfo extends Cart {
    payInfo: CartPayInfo;
}

export interface OrderCheckProduct extends Product {
    quantity: number;
}

export interface OrderCheckPayInfo extends CartPayInfo {
    couponDiscountAmount: number;
}

export type CouponDescription =
    | { type: 'EXPIRY_DATE'; content: { expiresAt: string } }
    | { type: 'MIN_ORDER_AMOUNT'; content: { minAmount: number } }
    | { type: 'USABLE_TIME'; content: { from: string; to: string } }
    | { type: 'MIN_QUANTITY_PER_PRODUCT'; content: { minQuantity: number } };

export interface Coupon {
    couponId: string;
    couponTitle: string;
    disabled: boolean;
    description: CouponDescription[];
}
