import {
  ProductModel,
  CartItemModel,
  CouponModel,
  CheckoutModel,
  CheckoutItemModel,
  CheckoutCouponModel,
} from "../models/index.js";
import { COUPON_CATEGORY } from "../interfaces/coupon.interface.js";

const seedProducts = [
  { id: 1, name: "상품 A", price: 35000, imageUrl: "https://placehold.co/80x80", stock: 10 },
  { id: 2, name: "상품 B", price: 25000, imageUrl: "https://placehold.co/80x80", stock: 3 },
  { id: 3, name: "재고 부족 상품", price: 15000, imageUrl: "https://placehold.co/80x80", stock: 1 },
  { id: 4, name: "재고 초과 상품", price: 20000, imageUrl: "https://placehold.co/80x80", stock: 2 },
];

const seedCartItems = [
  { id: 1, productId: 1, quantity: 2 },
  { id: 2, productId: 2, quantity: 1 },
  { id: 3, productId: 3, quantity: 1 },
  { id: 4, productId: 4, quantity: 5 },
];

const seedCoupons = [
  {
    id: 1,
    couponCode: "FIXED5000",
    name: "5,000원 할인 쿠폰",
    expiredDate: "2099-11-30",
    category: COUPON_CATEGORY.FIXED,
    amount: 5000,
    minOrderAmount: 100000,
  },
  {
    id: 2,
    couponCode: "BOGO",
    name: "2개 구매 시 1개 무료 쿠폰",
    expiredDate: "2099-05-30",
    category: COUPON_CATEGORY.BTGO,
  },
  {
    id: 3,
    couponCode: "FREESHIPPING",
    name: "5만원 이상 구매 시 무료 배송 쿠폰",
    expiredDate: "2099-08-31",
    category: COUPON_CATEGORY.FREESHIPPING,
    minOrderAmount: 50000,
  },
  {
    id: 4,
    couponCode: "MIRACLEMORNING30",
    name: "미라클모닝 30% 할인 쿠폰",
    expiredDate: "2099-07-31",
    category: COUPON_CATEGORY.RATE,
    rate: 30,
    usableStartAt: "04:00",
    usableEndAt: "07:00",
  },
];

async function seedIfEmpty<M extends { count: () => Promise<number>; bulkCreate: (rows: R[]) => Promise<unknown> }, R>(
  model: M,
  rows: R[],
): Promise<void> {
  if ((await model.count()) === 0) {
    await model.bulkCreate(rows);
  }
}

export async function seedDatabase(): Promise<void> {
  await seedIfEmpty(ProductModel, seedProducts);
  await seedIfEmpty(CartItemModel, seedCartItems);
  await seedIfEmpty(CouponModel, seedCoupons);
}

// 자식 테이블부터 비워 FK 제약을 피한다.
async function clearAll(): Promise<void> {
  await CheckoutCouponModel.destroy({ where: {} });
  await CheckoutItemModel.destroy({ where: {} });
  await CheckoutModel.destroy({ where: {} });
  await CartItemModel.destroy({ where: {} });
  await CouponModel.destroy({ where: {} });
  await ProductModel.destroy({ where: {} });
}

// 데모 환경에서 진행 중 데이터를 모두 지우고 시드 상태로 되돌린다.
export async function resetDatabase(): Promise<void> {
  await clearAll();
  await seedDatabase();
}
