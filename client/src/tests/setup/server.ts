import type { Cart } from "@/types/cartProduct";
import type { Order, PriceInfo } from "@/types/order";
import { delay, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

/**
 * 통합 테스트용 MSW 서버.
 *
 * 실제 서버처럼 "상태를 보존"하는 핸들러를 제공한다. PATCH/DELETE 가 in-memory `carts`
 * 를 변경하고, GET 이 그 결과를 돌려주므로 수량 변경/삭제 후 재조회(invalidate→refetch)
 * 흐름을 실제와 동일하게 검증할 수 있다.
 *
 * 앱의 fetcher 는 `import.meta.env.DEV === true`(테스트 stub) 이므로 baseUrl 이 "/api" 다.
 */

export const makeCart = (
  id: string,
  name: string,
  price: number,
  quantity: number,
): Cart => ({
  product: { id, name, price, image: `https://example.com/${id}.jpg` },
  quantity,
});

// src/mocks/handlers.ts 의 기본 장바구니와 동일한 구성
export const DEFAULT_CARTS: Cart[] = [
  makeCart("1", "무선 헤드폰", 129000, 1),
  makeCart("2", "러닝화", 89000, 2),
];

let carts: Cart[] = [];

/** 테스트 간 서버 상태를 초기화(또는 커스텀 데이터로 시드)한다. */
export function seedCarts(next: Cart[] = DEFAULT_CARTS) {
  // 핸들러가 객체를 직접 변경(quantity 갱신)하므로 깊은 복사로 격리한다.
  // (Cart 는 순수 JSON 데이터라 JSON 직렬화로 충분하며 jsdom 환경에서도 안전하다.)
  carts = JSON.parse(JSON.stringify(next)) as Cart[];
}

// --- 주문(order) 상태 -------------------------------------------------------
// POST /api/order 로 생성한 주문을 보존하고, GET /api/order 가 그 결과를 돌려준다.
// 주문 생성 → 주문 확인 페이지 진입(재조회) 흐름을 실제와 동일하게 검증할 수 있다.

const FREE_DELIVERY_THRESHOLD = 100_000;
const DELIVERY_FEE = 3_000;

/** 주문이 아직 생성되지 않았을 때 GET 이 돌려주는 빈 주문. */
const EMPTY_ORDER: Order = {
  orderId: "",
  orderProducts: [],
  isIsland: false,
  couponIds: [],
  priceInfo: { orderPrice: 0, discountPrice: 0, deliveryFee: 0, totalPrice: 0 },
};

let order: Order | null = null;

/** 주문 금액 정보를 상품/할인 기준으로 계산한다(배송비 정책은 장바구니와 동일). */
function calcPriceInfo(orderPrice: number, discountPrice: number): PriceInfo {
  const deliveryFee = orderPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  return {
    orderPrice,
    discountPrice,
    deliveryFee,
    totalPrice: orderPrice - discountPrice + deliveryFee,
  };
}

/** 테스트 간 주문 상태를 초기화한다. */
export function resetOrder() {
  order = null;
}

export const handlers = [
  http.get("/api/carts", () =>
    HttpResponse.json({
      status: "success",
      message: "장바구니를 정상적으로 조회하였습니다.",
      data: carts,
    }),
  ),

  http.patch("/api/carts/:id", async ({ params, request }) => {
    const id = String(params.id);
    const { quantity } = (await request.json()) as { quantity: number };
    const target = carts.find((cart) => cart.product.id === id);

    if (target) {
      target.quantity = quantity;
    }

    return HttpResponse.json({
      status: "success",
      message: "장바구니 상품 수량을 정상적으로 변경하였습니다.",
      data: target,
    });
  }),

  http.delete("/api/carts/:id", ({ params }) => {
    const id = String(params.id);
    carts = carts.filter((cart) => cart.product.id !== id);

    return HttpResponse.json({
      status: "success",
      message: "장바구니에서 상품을 정상적으로 제거하였습니다.",
      data: { id },
    });
  }),

  http.post("/api/order", async ({ request }) => {
    const { orderProducts } = (await request.json()) as {
      orderProducts: { productId: string; quantity: number }[];
    };

    // 주문 상품에 장바구니의 상품 정보(이름/가격/이미지)를 채워 Order 형태로 보존한다.
    const products = orderProducts.map(({ productId, quantity }) => {
      const cart = carts.find((cart) => cart.product.id === productId);
      return {
        productId,
        productName: cart?.product.name ?? "",
        productPrice: cart?.product.price ?? 0,
        imgUrl: cart?.product.image ?? "",
        quantity,
      };
    });

    const orderPrice = products.reduce(
      (sum, { productPrice, quantity }) => sum + productPrice * quantity,
      0,
    );

    order = {
      orderId: "order-1",
      orderProducts: products,
      isIsland: false,
      couponIds: [],
      priceInfo: calcPriceInfo(orderPrice, 0),
    };

    return HttpResponse.json({
      status: "success",
      message: "주문을 정상적으로 생성하였습니다.",
      data: { orderId: order.orderId },
    });
  }),

  http.get("/api/order", () =>
    HttpResponse.json({
      status: "success",
      message: "주문을 정상적으로 조회하였습니다.",
      data: order ?? EMPTY_ORDER,
    }),
  ),

  http.patch("/api/order", async ({ request }) => {
    const body = (await request.json()) as
      | { couponIds: string[] }
      | { isIsland: boolean };

    if (order) {
      if ("isIsland" in body) order.isIsland = body.isIsland;
      if ("couponIds" in body) order.couponIds = body.couponIds;
    }

    return HttpResponse.json({
      status: "success",
      message: "주문 정보를 정상적으로 변경하였습니다.",
      data: { priceInfo: (order ?? EMPTY_ORDER).priceInfo },
    });
  }),
];

/** GET /api/carts 가 500 을 반환하도록 오버라이드하는 핸들러 (server.use 로 사용) */
export const cartErrorHandler = http.get("/api/carts", () =>
  HttpResponse.json(
    { status: "error", message: "서버에서 오류가 발생했습니다." },
    { status: 500 },
  ),
);

/**
 * GET /api/carts 응답을 지연시키는 핸들러 (server.use 로 사용).
 * 로딩(Suspense fallback) 구간을 결정적으로 만들어 스켈레톤 노출을 안정적으로 검증한다.
 */
export const makeDelayedCartHandler = (ms: number) =>
  http.get("/api/carts", async () => {
    await delay(ms);
    return HttpResponse.json({
      status: "success",
      message: "장바구니를 정상적으로 조회하였습니다.",
      data: carts,
    });
  });

export const server = setupServer(...handlers);
