// server/ 의 CouponsService / OrdersService 도메인 로직을 그대로 포팅한 목 서비스 계층.
import { db } from "./db";
import type { CouponDB, OrderProduct, Product } from "./db";
import { ERROR_CODES, MockAppError } from "./errors";

// ---- products ----

// server ProductsService.getProductById: 없으면 NOT_EXIST_PRODUCT
export const getProductByIdOrThrow = (id: string): Product => {
  const product = db.products.get(id);
  if (!product) throw new MockAppError(ERROR_CODES.NOT_EXIST_PRODUCT);
  return product;
};

// ---- coupons (server CouponsService 포팅) ----

interface DiscountContextItem {
  productId: string;
  price: number;
  quantity: number;
}

export interface DiscountContext {
  orderPrice: number;
  deliveryFee: number;
  products: DiscountContextItem[];
}

const isCouponDisabled = (coupon: CouponDB): boolean =>
  coupon.isDisabled || coupon.couponExpiration < Date.now();

const isCouponUsable = (coupon: CouponDB, orderPrice: number): boolean => {
  if (coupon.isDisabled) return false;
  if (coupon.couponExpiration < Date.now()) return false;
  if (orderPrice < coupon.discountInfo.minimumOrderPrice) return false;
  return true;
};

const buildCouponOption = (coupon: CouponDB): string | undefined => {
  const { minimumOrderPrice, duration } = coupon.discountInfo;

  if (minimumOrderPrice > 0) {
    return `최소 주문 금액: ${minimumOrderPrice.toLocaleString("ko-KR")}원`;
  }

  if (duration.startDate !== 0 || duration.endDate !== 24) {
    return `사용 가능 시간: 오전 ${duration.startDate}시부터 ${duration.endDate}시까지`;
  }

  return undefined;
};

const computeDiscount = (
  coupon: CouponDB,
  context: DiscountContext,
): number => {
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
      discount = sortedPrices.length > info.requireAmount ? sortedPrices[0] : 0;
      break;
    }
    default:
      discount = 0;
  }

  return Math.min(discount, orderPrice);
};

export const getCouponList = () =>
  [...db.coupons.values()].map((coupon) => {
    const option = buildCouponOption(coupon);

    return {
      couponId: coupon.couponId,
      couponName: coupon.couponName,
      // couponDB에는 없지만 BE에서 계산해 내려주는 값
      isDisabled: isCouponDisabled(coupon),
      couponExpiration: coupon.couponExpiration,
      ...(option ? { option } : {}),
    };
  });

export const getBestCoupons = (context: DiscountContext, count?: number) =>
  [...db.coupons.values()]
    .filter((coupon) => isCouponUsable(coupon, context.orderPrice))
    .sort((a, b) => computeDiscount(b, context) - computeDiscount(a, context))
    .slice(0, count);

// server CouponsService.calculateDiscountPrice: 존재하지 않는 쿠폰은
// NOT_EXIST_COUPON(404), 조건 미달로 사용 불가한 쿠폰은 UNUSABLE_COUPON(400).
export const calculateDiscountPrice = (
  couponId: string,
  context: DiscountContext,
): number => {
  const coupon = db.coupons.get(couponId);

  if (!coupon) {
    throw new MockAppError(ERROR_CODES.NOT_EXIST_COUPON);
  }

  if (!isCouponUsable(coupon, context.orderPrice)) {
    throw new MockAppError(ERROR_CODES.UNUSABLE_COUPON);
  }

  return computeDiscount(coupon, context);
};

// server OrdersService.validateCouponIds: 존재하지 않는 쿠폰이면 NOT_EXIST_COUPON
export const assertCouponsExist = (couponIds: string[]) => {
  for (const couponId of couponIds) {
    if (!db.coupons.get(couponId)) {
      throw new MockAppError(ERROR_CODES.NOT_EXIST_COUPON);
    }
  }
};

// ---- orders (server OrdersService 가격 계산 포팅) ----

const DELIVERY_FEE = 3000;
const IS_ISLAND_DELIVERY_FEE = 3000;
const FREE_DELIVERY_THRESHOLD = 100000;

export const calculateShippingFee = (
  orderAmount: number,
  isIsland: boolean,
): number => {
  if (orderAmount >= FREE_DELIVERY_THRESHOLD) return 0;
  if (isIsland) return DELIVERY_FEE + IS_ISLAND_DELIVERY_FEE;
  return DELIVERY_FEE;
};

export const buildDiscountContextItems = (
  orderProducts: OrderProduct[],
): DiscountContextItem[] =>
  orderProducts.map(({ productId, quantity }) => {
    const product = getProductByIdOrThrow(productId);
    return { productId, price: product.price, quantity };
  });

export const calculateOrderPrice = (orderProducts: OrderProduct[]): number =>
  orderProducts.reduce((acc, { productId, quantity }) => {
    const product = getProductByIdOrThrow(productId);
    return acc + product.price * quantity;
  }, 0);

export const calculatePriceInfo = (
  orderProducts: OrderProduct[],
  couponIds: string[],
  isIsland: boolean,
) => {
  const orderPrice = calculateOrderPrice(orderProducts);
  const products = buildDiscountContextItems(orderProducts);
  const deliveryFee = calculateShippingFee(orderPrice, isIsland);

  const discountPrice = couponIds.reduce(
    (acc, couponId) =>
      acc +
      calculateDiscountPrice(couponId, { orderPrice, deliveryFee, products }),
    0,
  );

  const totalPrice = orderPrice - discountPrice + deliveryFee;

  return { orderPrice, deliveryFee, discountPrice, totalPrice };
};

// server 응답의 priceInfo 형태로 변환한다.
export const toPriceInfoResponse = (priceInfo: {
  orderPrice: number;
  deliveryFee: number;
  discountPrice: number;
  totalPrice: number;
}) => ({
  orderPrice: priceInfo.orderPrice,
  discountPrice: priceInfo.discountPrice,
  deliveryFee: priceInfo.deliveryFee,
  totalPrice: priceInfo.totalPrice,
});
