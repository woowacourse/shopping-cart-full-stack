import CartItem, { CartItemType } from "../cart/CartItem.js";
import { ProductType } from "../product/Product.js";
import { DELIVERY_FEE } from "./checkout.constant.js";

export type CheckoutItem = Pick<ProductType, "imgUrl" | "name" | "price"> &
  CartItemType;

class Checkout {
  #remoteArea: boolean;
  #appliedCouponIds: [number?, number?];
  #deliveryFee: number;
  constructor(
    private id: number,
    private checkoutItems: CheckoutItem[],
  ) {
    this.#remoteArea = false;
    this.#appliedCouponIds = [];
    this.#deliveryFee =
      this.getOrderPrice() >= DELIVERY_FEE.FREE_BOUNDARY
        ? DELIVERY_FEE.FREE
        : DELIVERY_FEE.DEFAULT;
  }

  updateRemoteArea(nextRemoteArea: boolean) {
    this.#remoteArea = nextRemoteArea;
  }

  updateAppliedCoupons(nextCouponIds: [number?, number?]) {
    this.#appliedCouponIds = nextCouponIds;
  }

  updateDeliveryFee(nextDeliveryFee: number) {
    this.#deliveryFee = nextDeliveryFee;
  }

  toJson() {
    return {
      id: this.id,
      checkoutItems: this.checkoutItems,
      remoteArea: this.#remoteArea,
      appliedCouponIds: this.#appliedCouponIds,
      deliveryFee: this.#deliveryFee,
    };
  }

  isSameId(checkoutId: number) {
    return checkoutId === this.id;
  }

  getOrderPrice() {
    return this.checkoutItems.reduce(
      (total, item) => total + item.itemCount * item.price,
      0,
    );
  }
}

export default Checkout;
