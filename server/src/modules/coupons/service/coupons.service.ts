import ERROR_CODES from "@/ERROR_CODE";
import createAppError from "@/errors/AppError";
import { CouponRepository } from "../repository/coupons.repository";
import { CouponDB } from "../types";

export interface DiscountContextItem {
  productId: string;
  price: number;
  quantity: number;
}

export interface DiscountContext {
  orderPrice: number;
  deliveryFee: number;
  products: DiscountContextItem[];
}

export interface OrderContextProvider {
  getCurrentDiscountContext(): DiscountContext | null;
}

export class CouponsService {
  private orderContextProvider: OrderContextProvider | null = null;

  constructor(private couponRepository: CouponRepository) {}

  setOrderContextProvider(provider: OrderContextProvider) {
    this.orderContextProvider = provider;
  }

  getCouponById(couponId: string) {
    return this.couponRepository.getCouponById(couponId);
  }

  getCouponList() {
    const context =
      this.orderContextProvider?.getCurrentDiscountContext() ?? null;
    const orderPrice = context?.orderPrice ?? 0;

    return this.couponRepository.getCoupons().map((coupon) => {
      const option = this.buildCouponOption(coupon);

      return {
        couponId: coupon.couponId,
        couponName: coupon.couponName,
        isDisabled: !this.isUsable(coupon, orderPrice),
        couponExpiration: coupon.couponExpiration,
        ...(option ? { option } : {}),
      };
    });
  }

  private buildCouponOption(coupon: CouponDB): string | undefined {
    const { minimumOrderPrice, duration } = coupon.discountInfo;

    if (minimumOrderPrice > 0) {
      return `최소 주문 금액: ${minimumOrderPrice.toLocaleString("ko-KR")}원`;
    }

    if (duration.startDate !== 0 || duration.endDate !== 24) {
      return `사용 가능 시간: 오전 ${duration.startDate}시부터 ${duration.endDate}시까지`;
    }

    return undefined;
  }

  calculateDiscountPrice(couponId: string, context: DiscountContext): number {
    const coupon = this.couponRepository.getCouponById(couponId);

    if (!coupon) {
      throw createAppError(ERROR_CODES.NOT_EXIST_COUPON);
    }

    if (!this.isUsable(coupon, context.orderPrice)) {
      throw createAppError(ERROR_CODES.UNUSABLE_COUPON);
    }

    return this.computeDiscount(coupon, context);
  }

  getBestCoupons(context: DiscountContext, count?: number) {
    return this.getSortedCouponsByDiscountPrice(context).slice(0, count);
  }

  private getSortedCouponsByDiscountPrice(context: DiscountContext) {
    const coupons = this.couponRepository.getCoupons();

    return coupons
      .filter((coupon) => this.isUsable(coupon, context.orderPrice))
      .sort(
        (a, b) =>
          this.computeDiscount(b, context) - this.computeDiscount(a, context),
      );
  }

  private isUsable(coupon: CouponDB, orderPrice: number): boolean {
    if (coupon.isDisabled) return false;
    if (coupon.couponExpiration < Date.now()) return false;
    if (orderPrice < coupon.discountInfo.minimumOrderPrice) return false;
    if (!this.isWithinUsableTime(coupon)) return false;
    return true;
  }

  private isWithinUsableTime(coupon: CouponDB): boolean {
    const { startDate, endDate } = coupon.discountInfo.duration;
    const currentHour = new Date().getHours();
    return currentHour >= startDate && currentHour < endDate;
  }

  private computeDiscount(coupon: CouponDB, context: DiscountContext): number {
    const { orderPrice, deliveryFee, products } = context;
    const info = coupon.discountInfo;

    let discount: number;

    switch (info.type) {
      case "percentage":
        discount = (orderPrice * info.value) / 100;
        break;
      case "fixed":
        discount = info.value;
        break;
      case "freeShipping":
        discount = deliveryFee;
        break;
      case "bogo": {
        const sortedPrices = products
          .flatMap((item) => Array(item.quantity).fill(item.price) as number[])
          .sort((a, b) => b - a);
        discount =
          sortedPrices.length > info.requireAmount ? sortedPrices[0] : 0;
        break;
      }
      default:
        discount = 0;
    }

    return Math.min(discount, orderPrice);
  }
}
