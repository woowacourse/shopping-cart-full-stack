import { NotFoundError } from "../../errors.js";
import {
  CouponRepository,
  TempOrderRepository,
} from "../repositories/InMemoryRepositories.js";

export class DiscountSummaryService {
  constructor(
    private readonly tempOrderRepository: TempOrderRepository,
    private readonly couponRepository: CouponRepository,
  ) {}

  calculate(orderId: string, couponIds: string[]) {
    const tempOrder = this.tempOrderRepository.findById(orderId);
    if (!tempOrder) throw new NotFoundError();

    const coupons = couponIds.map((couponId) => {
      const coupon = this.couponRepository.findById(couponId);
      if (!coupon) throw new NotFoundError();
      return coupon;
    });
    const newOrder = tempOrder.withCoupons(coupons);
    return { discount_price: newOrder.totalDiscountPrice() };
  }
}
