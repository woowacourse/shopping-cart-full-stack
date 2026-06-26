import type {
  CheckoutItemResponse,
  CouponResponse,
  CreateCheckoutRequest,
  GetCheckoutResponse,
} from "./checkoutSchema";
import type { Checkout, CheckoutItem } from "../../domain/checkout";
import type { Coupon } from "../../domain/coupon";
import { CART_ITEM_STATUS, type CartItem } from "../../domain/cart";

export function toCheckoutItems(
  cartItems: CartItem[],
  getItemSelection: (id: number) => boolean,
): CreateCheckoutRequest["items"] {
  return cartItems
    .filter((item) => getItemSelection(item.id) && item.status === CART_ITEM_STATUS.AVAILABLE)
    .map((item) => ({ product_id: item.id, quantity: item.quantity }));
}

export function toCheckout(response: GetCheckoutResponse): Checkout {
  return {
    checkoutId: response.checkout_id,
    items: response.items.map(toCheckoutItem),
    coupons: response.coupons.map(toCoupon),
    remoteArea: response.remote_area,
    checkoutAmount: response.checkout_amount,
    couponDiscount: response.coupon_discount,
    shippingFee: response.shipping_fee,
    totalAmount: response.total_amount,
  };
}

function toCheckoutItem(item: CheckoutItemResponse): CheckoutItem {
  return {
    productId: item.product_id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.image_url,
  };
}

function toCoupon(coupon: CouponResponse): Coupon {
  return {
    id: coupon.coupon_id,
    name: coupon.name,
    expiredDate: coupon.expired_date ? toDate(coupon.expired_date) : undefined,
    minOrderAmount: coupon.min_order_amount,
    usableStartAt: coupon.usable_start_at,
    usableEndAt: coupon.usable_end_at,
    isSelected: coupon.is_selected,
    disabled: coupon.disabled,
  };
}

function toDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}
