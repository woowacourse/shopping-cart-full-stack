import type { InMemoryDB } from "./in-memory-db.js";
import { DEFAULT_IMAGE } from "../assets/config.js";

export function seed(db: InMemoryDB): void {
  db.PRODUCT_TABLE.push(
    { id: 1, name: "베이직 코튼 티셔츠", price: 19900, imgUrl: DEFAULT_IMAGE },
    { id: 2, name: "슬림핏 청바지", price: 49900, imgUrl: DEFAULT_IMAGE },
    { id: 3, name: "오버핏 후드티", price: 39900, imgUrl: DEFAULT_IMAGE },
    { id: 4, name: "캐주얼 반팔 셔츠", price: 29900, imgUrl: DEFAULT_IMAGE },
    { id: 5, name: "스트라이프 롱슬리브", price: 24900, imgUrl: DEFAULT_IMAGE },
  );

  db.CART_TABLE.push(
    { product_id: 1, quantity: 2 },
    { product_id: 3, quantity: 1 },
    { product_id: 5, quantity: 3 },
  );

  db.COUPON_TABLE.push({
    id: "FIXED5000",
    name: "5,000원 할인 쿠폰",
    expiriation_date: new Date("2026-11-30"),
    rule_type: "LOW_PRICE",
    limit_price: 100000, // 최소 주문 금액
    start_time: null,
    end_time: null,
    discount_type: "FIXED",
    discount_fixed: 5000, // 할인 금액
    discount_rate: null,
  });

  db.COUPON_TABLE.push({
    id: "BOGO",
    name: "2개 구매 시 1개 무료 쿠폰",
    expiriation_date: new Date("2026-06-30"),
    rule_type: null,
    limit_price: null,
    start_time: null,
    end_time: null,
    discount_type: "BOGO",
    discount_fixed: null,
    discount_rate: null,
  });

  db.COUPON_TABLE.push({
    id: "FREESHIPPING",
    name: "5만원 이상 구매 시 무료 배송 쿠폰",
    expiriation_date: new Date("2026-08-31"),
    rule_type: "LOW_PRICE",
    limit_price: 50000, // 최소 주문 금액
    start_time: null,
    end_time: null,
    discount_type: "FREESHIPPING",
    discount_fixed: null,
    discount_rate: null,
  });

  db.COUPON_TABLE.push({
    id: "MIRACLESALE",
    name: "미라클모닝 30% 할인 쿠폰",
    expiriation_date: new Date("2026-07-31"),
    rule_type: "TIME",
    limit_price: null,
    start_time: "04:00",
    end_time: "07:00",
    discount_type: "MIRACLESALE",
    discount_fixed: null,
    discount_rate: 30, // 할인율 30
  });
}
