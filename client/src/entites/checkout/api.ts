import { formatDate } from "../../shared/date";
import { http } from "../../shared/http";
import type { CartItem, Checkout, Coupon, Discount, Rule } from "./model";

export interface CheckoutRequest {
  checkedProductIds: number[];
  hardDeliveryPlace: boolean;
  selectedCouponIds: string[];
}

interface CheckoutProps {
  checked_product_list: string[];
  hard_delivery_place: boolean;
  selected_coupons: string[];
}

interface CheckoutDto {
  price_summary: {
    order_price: number;
    dicount_price: number;
    delivery_price: number;
    total_price: number;
  };
  selected_items: CartItem[];
  coupons_info: {
    id: string;
    name: string;
    expiriation_date: string;
    rule?: Rule;
    status: Coupon["status"];
    discount: Discount;
  }[];
  best_coupons: string[];
  gifts: { product_id: string; quantity: number }[];
}

const toCheckoutDto = (req: CheckoutRequest): CheckoutProps => ({
  checked_product_list: req.checkedProductIds.map(String),
  hard_delivery_place: req.hardDeliveryPlace,
  selected_coupons: req.selectedCouponIds,
});

const toCheckout = (res: CheckoutDto): Checkout => ({
  priceSummary: {
    orderPrice: res.price_summary.order_price,
    discountPrice: res.price_summary.dicount_price,
    deliveryPrice: res.price_summary.delivery_price,
    totalPrice: res.price_summary.total_price,
  },
  selectedItems: res.selected_items.map((item) => ({
    id: item.id,
    product: {
      name: item.product.name,
      price: item.product.price,
      thumbnail: item.product.thumbnail,
    },
    quantity: item.quantity,
  })),
  couponsInfo: res.coupons_info.map((coupon) => ({
    id: coupon.id,
    name: coupon.name,
    expirationDate: formatDate(coupon.expiriation_date),
    rule: coupon.rule,
    status: {
      type: coupon.status.type,
      message: coupon.status.message,
      apply: coupon.status.apply,
    },
    discount: coupon.discount,
  })),
  bestCoupons: res.best_coupons,
  gifts: res.gifts.map((gift) => ({
    productId: gift.product_id,
    quantity: gift.quantity,
  })),
});

export const checkoutApi = async (req: CheckoutRequest): Promise<Checkout> => {
  const dto = await http<CheckoutDto>("/checkout", {
    method: "POST",
    body: JSON.stringify(toCheckoutDto(req)),
  });
  return toCheckout(dto);
};
