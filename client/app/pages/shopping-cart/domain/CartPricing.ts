import DeliveryFee from "./DeliveryFee";
import Cart from "./Cart";

export type PriceSummary = {
  price: number;
  delivery: number;
  totalPrice: number;
};

class CartPricing {
  constructor(
    private readonly cart: Cart,
    private readonly deliveryFee: DeliveryFee,
  ) {
    this.cart = cart;
    this.deliveryFee = deliveryFee;
  }

  public calculatePriceSummary(): PriceSummary {
    const price = this.cart.calculateItemTotalPrice();
    const delivery = this.cart.selectedItemCount()
      ? this.deliveryFee.calculate(price)
      : 0;
    const totalPrice = price + delivery;

    return { price, delivery, totalPrice };
  }
}

export default CartPricing;
