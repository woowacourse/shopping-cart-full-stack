import { NotFoundError } from "../../errors.js";
import TempOrder from "../models/TempOrder.js";
import {
  DeliveryFee,
  HardPlacePolicy,
  FreeDeliveryPolicy,
} from "../models/DeliveryFee.js";
import { findBestCouponCombination } from "../couponCalculator.js";
import {
  DELIVERY_PRICE_POLICY,
  FREE_DELIVERY_THRESHOLD,
} from "../constants.js";
import {
  CouponRepository,
  ProductRepository,
  TempOrderRepository,
} from "../repositories/InMemoryRepositories.js";

export class TempOrderService {
  constructor(
    private readonly tempOrderRepository: TempOrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly couponRepository: CouponRepository,
  ) {}

  getById(id: string) {
    const tempOrder = this.tempOrderRepository.findById(id);
    if (!tempOrder) throw new NotFoundError();
    return tempOrder.toObject();
  }

  create(rawItems: { product_id: string; quantity: number }[]) {
    const items = this.convertToItems(rawItems);
    const delivery = this.buildDelivery(false);
    const tempOrderForCheck = new TempOrder(items, delivery, []);
    const activeCoupons = this.couponRepository
      .findAll()
      .filter((c) => c.isAvailable(tempOrderForCheck));
    const bestCoupons = findBestCouponCombination(
      tempOrderForCheck,
      activeCoupons,
    );
    const tempOrder = new TempOrder(items, delivery, bestCoupons);

    const id = tempOrder.getId();
    this.tempOrderRepository.save(id, tempOrder);
    return { order_id: id };
  }

  patch(
    id: string,
    body: { hard_delivery_place?: boolean; selected_coupons?: string[] },
  ) {
    let order = this.tempOrderRepository.findById(id);
    if (!order) throw new NotFoundError();

    const { hard_delivery_place, selected_coupons } = body;

    if (hard_delivery_place !== undefined) {
      order = order.withDelivery(this.buildDelivery(hard_delivery_place));
    }

    if (selected_coupons !== undefined) {
      order = order.withCoupons(this.convertToCoupons(selected_coupons));
    }

    this.tempOrderRepository.save(order.getId(), order);
    return order.toObject();
  }

  private convertToItems(rawItems: { product_id: string; quantity: number }[]) {
    return rawItems.map((item) => {
      const product = this.productRepository.findById(item.product_id);
      if (!product) throw new NotFoundError();
      const { id: _id, ...productData } = product.toObject();
      return { ...item, product: productData };
    });
  }

  private buildDelivery(isHardPlace: boolean) {
    const defaultPolicies = [new FreeDeliveryPolicy(FREE_DELIVERY_THRESHOLD)];
    const policies = isHardPlace
      ? [
          new HardPlacePolicy(DELIVERY_PRICE_POLICY.hardPlace),
          ...defaultPolicies,
        ]
      : [...defaultPolicies];
    return new DeliveryFee(
      DELIVERY_PRICE_POLICY.default,
      policies,
      isHardPlace,
    );
  }

  private convertToCoupons(ids: string[]) {
    return ids.map((couponId) => {
      const coupon = this.couponRepository.findById(couponId);
      if (!coupon) throw new NotFoundError();
      return coupon;
    });
  }
}
