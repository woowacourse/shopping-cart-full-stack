import { BadRequestError } from "../../errors/http-error.js";
import { type CartDetail } from "../cart/cart.repository.js";
import CartService from "../cart/cart.service.js";
import { type CouponRepository } from "../coupon/coupon.repository.js";
import {
  Coupon,
  CouponProps,
  CouponResult,
  CouponStatus,
  DiscountView,
  Gift,
  Summary,
} from "../coupon/coupon.type.js";
import {
  BASE_DELIVERY_PRICE,
  HARD_DELIVERY_PRICE,
  FREE_DELIVERY_THRESHOLD,
  CheckoutProps,
} from "./checkout.js";

export interface SelectedItem {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export interface CouponResponseStatus extends CouponStatus {
  apply: boolean;
}

export interface CouponInfo {
  coupon: Coupon;
  status: CouponResponseStatus;
  discount: DiscountView;
}

export interface CheckoutResult {
  summary: Summary;
  // hardDeliveryPrice: number; 없어도될듯
  selectedItems: SelectedItem[];
  coupons: CouponInfo[];
  bestCouponIds: string[];
  gifts: Gift[];
}

export default class CheckoutService {
  constructor(
    private cartService: CartService,
    private couponRepository: CouponRepository,
  ) {}

  async checkout(args: CheckoutProps): Promise<CheckoutResult> {
    const { checkedProductIds, hardDeliveryPlace, selectedCouponIds } = args;

    const cart = await this.cartService.getAll();
    const checked = cart.filter((item) => checkedProductIds.includes(String(item.product.id)));
    if (checkedProductIds.length !== checked.length) {
      throw new BadRequestError("존재하지않는 상품입니다");
    }

    const props = this.formatProps(checked, hardDeliveryPlace);

    const allCoupons = await this.couponRepository.findAll();
    const bestCouponIds = await this.getBestCoupons(props);

    const appliedCouponIds = selectedCouponIds.length > 0 ? selectedCouponIds : bestCouponIds;

    const coupons = allCoupons.map((coupon): CouponInfo => {
      const status = coupon.canUse(props);
      return {
        coupon,
        status: {
          ...status,
          apply: status.type === "USABLE" && appliedCouponIds.includes(coupon.id),
        },
        discount: coupon.discountView(props),
      };
    });

    const { summary, gifts } = this.calculate(
      coupons.filter((info) => info.status.apply).map((info) => info.coupon),
      props,
    );

    return {
      summary,
      selectedItems: checked.map((item) => ({
        id: String(item.product.id),
        name: item.product.name,
        price: item.product.price,
        thumbnail: item.product.imgUrl,
        quantity: item.quantity,
      })),
      coupons,
      bestCouponIds,
      gifts,
    };
  }

  async getBestCoupons(props: CouponProps): Promise<string[]> {
    const coupons = await this.couponRepository.findAll();
    const usable = coupons.filter((coupon) => coupon.canUse(props).type === "USABLE");

    // 예외처리( 한장만 사용 가능할때 한장으로)
    if (usable.length === 0) return [];
    if (usable.length === 1) return [usable[0].id];

    const bestCoupon: { id: string[]; cost: number } = {
      id: [],
      cost: props.summary.totalPrice,
    };

    for (let i = 0; i < usable.length; i++) {
      for (let j = i + 1; j < usable.length; j++) {
        const result = this.calculate([usable[i], usable[j]], props);
        const cost = result.summary.totalPrice - this.giftValue(result, props);
        if (cost < bestCoupon.cost) {
          bestCoupon.cost = cost;
          bestCoupon.id = [usable[i].id, usable[j].id];
        }
      }
    }
    return bestCoupon.id;
  }

  private giftValue(result: CouponResult, props: CouponProps): number {
    let total = 0;
    for (const gift of result.gifts) {
      const item = props.checkoutCartList.find((c) => c.productId === gift.productId);
      if (!item) continue;
      total += item.price * gift.quantity;
    }
    return total;
  }

  private calculate(coupons: Coupon[], props: CouponProps): CouponResult {
    const rank = (coupon: Coupon) => (coupon.discountType.type === "MIRACLESALE" ? 1 : 0);
    return [...coupons]
      .sort((a, b) => rank(a) - rank(b))
      .reduce<CouponResult>((acc, coupon) => coupon.execute(acc), { ...props });
  }

  private formatProps(checked: CartDetail[], hardDeliveryPlace: boolean): CouponProps {
    const checkoutCartList = checked.map((item) => ({
      productId: String(item.product.id),
      quantity: item.quantity,
      price: item.product.price,
    }));

    const orderPrice = checkoutCartList.reduce((acc, cart) => acc + cart.price * cart.quantity, 0);
    const baseDeliveryPrice = orderPrice >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY_PRICE;
    const hardDeliveryPrice = hardDeliveryPlace ? HARD_DELIVERY_PRICE : 0;
    const deliveryPrice = baseDeliveryPrice + hardDeliveryPrice;

    return {
      checkoutCartList,
      summary: {
        orderPrice,
        discountPrice: 0,
        deliveryPrice,
        totalPrice: orderPrice + deliveryPrice,
      },
      gifts: [],
    };
  }
}
