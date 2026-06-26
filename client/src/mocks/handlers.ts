import { cartsHandlers } from "./carts.handlers";
import { couponsHandlers } from "./coupons.handlers";
import { ordersHandlers } from "./orders.handlers";
import { productsHandlers } from "./products.handlers";

// server/ 에 정의된 모든 엔드포인트를 미러링한 MSW 핸들러.
// 시드 데이터 / 응답 형태 / 검증 및 에러 흐름까지 실제 서버와 동일하게 동작한다.
export const handlers = [
  ...productsHandlers,
  ...cartsHandlers,
  ...couponsHandlers,
  ...ordersHandlers,
];
