import { Request, Response } from "express";
import type CheckoutService from "./checkout.service.js";
import type { CheckoutResult, CouponInfo } from "./checkout.service.js";
import { BadRequestError } from "../../errors/http-error.js";

export default class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  checkout = async (req: Request, res: Response) => {
    const { checked_product_list, hard_delivery_place, selected_coupons } = req.body;

    if (!Array.isArray(checked_product_list)) {
      throw new BadRequestError("요청 형식이 올바르지 않습니다.");
    }

    const result = await this.checkoutService.checkout({
      checkedProductIds: checked_product_list.map(String),
      hardDeliveryPlace: Boolean(hard_delivery_place),
      selectedCouponIds: Array.isArray(selected_coupons) ? selected_coupons.map(String) : [],
    });

    const { summary, selectedItems, coupons, bestCouponIds, gifts }: CheckoutResult = result;
    res.status(200).json({
      price_summary: {
        order_price: summary.orderPrice,
        dicount_price: summary.discountPrice,
        delivery_price: summary.deliveryPrice,
        total_price: summary.totalPrice,
      },
      // hard_delivery_price: hardDeliveryPrice,
      selected_items: selectedItems.map((item) => ({
        id: item.id,
        product: { name: item.name, price: item.price, thumbnail: item.thumbnail },
        quantity: item.quantity,
      })),
      coupons_info: coupons.map((status) => this.toCouponInfo(status)),
      best_coupons: bestCouponIds,
      gifts: gifts.map((gift) => ({ product_id: gift.productId, quantity: gift.quantity })),
    });
  };

  private toCouponInfo({ coupon, status, discount }: CouponInfo) {
    return {
      id: coupon.id,
      name: coupon.name,
      expiriation_date: coupon.expiriationDate,
      rule: coupon.rule ?? null,
      status,
      discount,
    };
  }
}
