import { Coupon } from "../models/Coupon.js";
import {
  CouponRepository,
  TempOrderRepository,
} from "../repositories/InMemoryRepositories.js";
import { NotFoundError } from "../../errors.js";
import { COUPON_SELECT_LIMIT } from "../constants.js";

export class CouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly tempOrderRepository: TempOrderRepository,
  ) {}

  getByOrderId(orderId: string) {
    const tempOrder = this.tempOrderRepository.findById(orderId);
    if (!tempOrder) throw new NotFoundError();
    return {
      items: this.couponRepository.findAll().map((c: Coupon) => ({
        ...c.toObject(),
        is_active: c.isAvailable(tempOrder),
      })),
      max_coupon_count: COUPON_SELECT_LIMIT,
    };
  }
}
