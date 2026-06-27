import { ModelError } from '../../errors/ModelError.js';

type OrderParams = {
  orderId: string;
  products: { productId: string; quantity: number }[];
  couponIds: string[];
};

export class Order {
  orderId;
  products;
  isIsland;
  couponIds;

  constructor(params: OrderParams) {
    // 상품 개수 검증, 쿠폰 개수 및 중복 검증
    this.validateProductCount(params.products);
    this.validateCouponCount(params.couponIds);

    this.orderId = params.orderId;
    this.products = params.products;
    this.isIsland = false;
    this.couponIds = params.couponIds;
  }

  // 쿠폰 변경
  changeCoupons(couponIds: string[]) {
    this.validateCouponCount(couponIds);

    this.couponIds = couponIds;
  }

  // 배송지 변경
  changeDeliveryArea(isIsland: boolean) {
    this.isIsland = isIsland;
  }

  validateProductCount(products: OrderParams['products']) {
    if (products.length === 0)
      throw new ModelError(
        'EMPTY_ORDER_PRODUCTS',
        '주문 상품 목록이 비어 있습니다.',
      );
  }
  validateCouponCount(couponIds: string[]) {
    if (couponIds.length > 2)
      throw new ModelError(
        'EXCEEDS_MAX_COUPON_COUNT',
        '쿠폰은 최대 2개까지만 적용할 수 있습니다.',
      );
    if (new Set(couponIds).size !== couponIds.length) {
      throw new ModelError(
        'DUPLICATE_COUPON_ID',
        '중복된 쿠폰은 적용할 수 없습니다.',
      );
    }
  }
}
