import { ProductType } from "./Product.js";
import { DeliveryFee } from "./DeliveryFee.js";
import { Coupon } from "./Coupon.js";
import { calculateDiscount } from "../couponCalculator.js";
import { OrderContext } from "../types.js";

type OrderItem = {
  product_id: string;
  quantity: number;
  product: Omit<ProductType, "id">;
};

class TempOrder implements OrderContext {
  constructor(
    private readonly items: OrderItem[],
    private readonly deliveryFee: DeliveryFee,
    private readonly selectedCoupons: Coupon[],
    private readonly id: string = crypto.randomUUID(),
  ) {}

  public calculateDeliveryFee() {
    return this.deliveryFee.getDeliveryFee(this.calculateOrderPrice());
  }

  public calculateOrderPrice() {
    return this.items.reduce(
      (price, item) => price + item.quantity * item.product.price,
      0,
    );
  }

  public findMostExpensiveItemPrice(minQuantity: number): number | undefined {
    const items = this.items.filter((item) => item.quantity >= minQuantity);
    return items.sort((a, b) => b.product.price - a.product.price)[0]?.product
      .price;
  }

  private discountPriceSummary() {
    const discountPrice = calculateDiscount(
      this,
      this.selectedCoupons.filter((c) => !c.isDeliveryDiscount()),
    );
    const deliveryDiscountPrice = calculateDiscount(
      this,
      this.selectedCoupons.filter((c) => c.isDeliveryDiscount()),
    );
    return { discountPrice, deliveryDiscountPrice };
  }

  public totalDiscountPrice() {
    const { discountPrice, deliveryDiscountPrice } =
      this.discountPriceSummary();
    return discountPrice + deliveryDiscountPrice;
  }

  private priceSummary() {
    const order_price = this.calculateOrderPrice();
    const delivery_fee = this.calculateDeliveryFee();
    const { discountPrice, deliveryDiscountPrice } =
      this.discountPriceSummary();
    const delivery_price = delivery_fee - deliveryDiscountPrice;
    return {
      order_price,
      discount_price: discountPrice,
      delivery_price,
      total_price: order_price - discountPrice + delivery_price,
    };
  }

  public toObject() {
    return {
      id: this.id,
      hard_delivery_place: this.deliveryFee.isHardPlace(),
      selected_coupons: this.selectedCoupons.map((c) => c.getId()),
      selected_items: this.items,
      price_summary: this.priceSummary(),
    };
  }

  public getId() {
    return this.id;
  }

  public withDelivery(deliveryFee: DeliveryFee): TempOrder {
    return this.copyWith({ deliveryFee });
  }

  public withCoupons(coupons: Coupon[]): TempOrder {
    return this.copyWith({ coupons });
  }

  private copyWith({
    deliveryFee,
    coupons,
  }: {
    deliveryFee?: DeliveryFee;
    coupons?: Coupon[];
  }) {
    return new TempOrder(
      this.items,
      deliveryFee ? deliveryFee : this.deliveryFee,
      coupons ? coupons : this.selectedCoupons,
      this.id,
    );
  }
}

export default TempOrder;
