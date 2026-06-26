import {
  AmountDiscountCoupon,
  BonusCoupon,
  FreeDeliveryCoupon,
  RateDiscountCoupon,
} from "./models/Coupon.js";
import {
  MinimumOrderPriceDiscountCondition,
  HotTimeDiscountCondition,
} from "./models/DiscountCondition.js";

export const SEED_DATA = {
  products: [
    { name: "치킨", thumbnail: "/chicken.png", price: 25000, quantity: 2 },
    { name: "피자", thumbnail: "/pizza.jpg", price: 30000, quantity: 5 },
    {
      name: "꿔바로우",
      thumbnail: "/guobaorou.jpg",
      price: 45000,
      quantity: 1,
    },
    {
      name: "홈런볼",
      thumbnail: "/home-run-ball.jpg",
      price: 1500,
      quantity: 99,
    },
  ],
  coupons: [
    new AmountDiscountCoupon({
      conditions: [new MinimumOrderPriceDiscountCondition(100_000)],
      discountPrice: 5000,
      expirationDate: new Date("2026-11-30T23:59:59"),
    }),
    new BonusCoupon({
      conditions: [],
      minQuantity: 2,
      bonusCount: 1,
      expirationDate: new Date("2026-06-30T23:59:59"),
    }),
    new FreeDeliveryCoupon({
      conditions: [new MinimumOrderPriceDiscountCondition(50_000)],
      expirationDate: new Date("2026-08-31T23:59:59"),
    }),
    new RateDiscountCoupon({
      conditions: [new HotTimeDiscountCondition(4, 7)],
      discountRate: 30,
      expirationDate: new Date("2026-07-31T23:59:59"),
    }),
  ],
};
