import { http, HttpResponse } from "msw";
import type { CouponResponse } from "../apis/checkout/checkoutSchema";
import { CART_ITEM_STATUS } from "../domain/cart";

const BASE_URL = "http://localhost:3000";

export interface MockProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface MockCartItem {
  id: number;
  productId: number;
  quantity: number;
}

export const defaultProducts: MockProduct[] = [
  { id: 1, name: "상품 A", price: 35000, imageUrl: "https://placehold.co/80x80", stock: 10 },
  { id: 2, name: "상품 B", price: 25000, imageUrl: "https://placehold.co/80x80", stock: 3 },
  { id: 3, name: "재고 부족 상품", price: 15000, imageUrl: "https://placehold.co/80x80", stock: 1 },
];

export const defaultCartItems: MockCartItem[] = [
  { id: 1, productId: 1, quantity: 2 },
  { id: 2, productId: 2, quantity: 1 },
  { id: 3, productId: 3, quantity: 1 },
];

const errorResponse = (error: string, message: string, status: number) =>
  HttpResponse.json({ error, message }, { status });

const getCartItemStatus = (quantity: number, stock: number) => {
  if (stock === 0) return CART_ITEM_STATUS.OUT_OF_STOCK;
  if (quantity > stock) return CART_ITEM_STATUS.QUANTITY_EXCEEDED;
  return CART_ITEM_STATUS.AVAILABLE;
};

export interface PatchDelayController {
  wait: () => Promise<void>;
}

const FIXED_DISCOUNT_COUPON_ID = 1; // 5,000원 정액 할인
const BTGO_COUPON_ID = 2; // 2개 구매 시 1개 무료 (3개당 1개 무료)
const FREE_SHIPPING_COUPON_ID = 3; // 5만원 이상 무료 배송
const PERCENT_DISCOUNT_COUPON_ID = 4; // 30% 정률 할인 (우선순위 낮음)

const FIXED_DISCOUNT_AMOUNT = 5000;
const PERCENT_DISCOUNT_RATE = 0.3;

// 쿠폰 목록은 서버 contract(CouponResponse)를 그대로 따른다. is_selected는 응답 빌드 시점에
// selectedCouponIds 기준으로 매번 덮어쓰므로 정의에서는 false로 둔다.
export const defaultCoupons: CouponResponse[] = [
  {
    coupon_id: FIXED_DISCOUNT_COUPON_ID,
    name: "5,000원 할인 쿠폰",
    expired_date: "2024-11-30",
    min_order_amount: 100000,
    is_selected: false,
    disabled: false,
  },
  {
    coupon_id: BTGO_COUPON_ID,
    name: "2개 구매 시 1개 무료 쿠폰",
    expired_date: "2024-05-30",
    is_selected: false,
    disabled: false,
  },
  {
    coupon_id: FREE_SHIPPING_COUPON_ID,
    name: "5만원 이상 구매 시 무료 배송 쿠폰",
    expired_date: "2024-08-31",
    min_order_amount: 50000,
    is_selected: false,
    disabled: false,
  },
  {
    coupon_id: PERCENT_DISCOUNT_COUPON_ID,
    name: "미라클모닝 30% 할인 쿠폰",
    expired_date: "2024-07-31",
    usable_start_at: "04:00",
    usable_end_at: "07:00",
    is_selected: false,
    disabled: false,
  },
];

const SHIPPING_FEE = 3000;
const REMOTE_AREA_FEE = 3000;

interface CheckoutItemState {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CheckoutState {
  checkoutId: number;
  items: CheckoutItemState[];
  remoteArea: boolean;
  selectedCouponIds: number[];
}

export const createHandlers = (
  initialProducts: MockProduct[] = defaultProducts,
  initialCartItems: MockCartItem[] = defaultCartItems,
  patchDelay?: PatchDelayController,
) => {
  const products = initialProducts.map((p) => ({ ...p }));
  const cartItems = initialCartItems.map((c) => ({ ...c }));
  const coupons = defaultCoupons.map((c) => ({ ...c }));

  const checkouts = new Map<number, CheckoutState>();

  // 새로고침/HMR로 인메모리 상태가 초기화돼도 /checkout/1로 바로 진입할 수 있도록 기본 checkout을 시드한다.
  const seedItems = cartItems.map(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId)!;
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    };
  });
  checkouts.set(1, { checkoutId: 1, items: seedItems, remoteArea: false, selectedCouponIds: [1] });

  let nextCheckoutId = 2;

  const calcCheckoutAmount = (items: CheckoutState["items"]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // BTGO: 같은 상품을 3개 살 때마다 1개 무료. 무료가 되는 건 가장 비싼 1개 단가 기준.
  const calcBtgoDiscount = (items: CheckoutState["items"]) =>
    items.reduce((sum, item) => sum + Math.floor(item.quantity / 3) * item.price, 0);

  // 배송비: 10만원 이상이면 무료, 아니면 기본 3,000원(도서산간 +3,000원). 쿠폰과 무관하게 결정된다.
  const calcShippingFee = (items: CheckoutState["items"], remoteArea: boolean) => {
    if (calcCheckoutAmount(items) >= 100000) return 0;
    return SHIPPING_FEE + (remoteArea ? REMOTE_AREA_FEE : 0);
  };

  // 목 전용 할인 계산.
  // - 정액/BTGO: 주문금액(물건값)에서 차감.
  // - 정률(30%): 우선순위가 낮아 정액/BTGO를 먼저 적용해 줄어든 '물건값 기준'에 적용한다.
  // - 무료배송: 배송비와 동일한 금액을 쿠폰 할인으로 상쇄한다. 물건값이 아니라 배송비를 대상으로 하므로
  //   정률(30%)의 계산 베이스에는 들어가지 않는다. (배송비는 그대로 부과되고 coupon_discount가 그만큼
  //   커져 total에서 배송비가 상쇄됨)
  const calcCouponDiscount = (selectedCouponIds: number[], items: CheckoutState["items"], remoteArea: boolean) => {
    const orderAmount = calcCheckoutAmount(items);

    let priorDiscount = 0;
    if (selectedCouponIds.includes(FIXED_DISCOUNT_COUPON_ID)) priorDiscount += FIXED_DISCOUNT_AMOUNT;
    if (selectedCouponIds.includes(BTGO_COUPON_ID)) priorDiscount += calcBtgoDiscount(items);

    const percentDiscount = selectedCouponIds.includes(PERCENT_DISCOUNT_COUPON_ID)
      ? Math.floor((orderAmount - priorDiscount) * PERCENT_DISCOUNT_RATE)
      : 0;

    const freeShippingDiscount = selectedCouponIds.includes(FREE_SHIPPING_COUPON_ID)
      ? calcShippingFee(items, remoteArea)
      : 0;

    return priorDiscount + percentDiscount + freeShippingDiscount;
  };

  const buildCheckoutResponse = (state: CheckoutState) => {
    const checkoutAmount = calcCheckoutAmount(state.items);
    const couponDiscount = calcCouponDiscount(state.selectedCouponIds, state.items, state.remoteArea);
    const shippingFee = calcShippingFee(state.items, state.remoteArea);
    const totalAmount = checkoutAmount - couponDiscount + shippingFee;

    return {
      checkout_id: state.checkoutId,
      items: state.items.map((item) => ({
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.imageUrl,
      })),
      coupons: coupons.map((c) => ({
        ...c,
        is_selected: state.selectedCouponIds.includes(c.coupon_id),
      })),
      remote_area: state.remoteArea,
      checkout_amount: checkoutAmount,
      coupon_discount: couponDiscount,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
    };
  };

  return [
    http.post(`${BASE_URL}/checkouts`, async ({ request }) => {
      const body = (await request.json()) as { items?: { product_id: number; quantity: number }[] };
      const requestedItems = body.items ?? [];

      const items = requestedItems.map(({ product_id, quantity }) => {
        // product_id로 직접 찾고, 없으면 cart item id 기반으로 폴백 해석한다.
        const product =
          products.find((p) => p.id === product_id) ??
          products.find((p) => p.id === cartItems.find((c) => c.id === product_id)?.productId)!;
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
        };
      });

      const checkout_id = nextCheckoutId++;
      // 진입 시 최대 혜택 쿠폰(여기선 5,000원 할인) 자동 선택
      checkouts.set(checkout_id, { checkoutId: checkout_id, items, remoteArea: false, selectedCouponIds: [1] });

      return HttpResponse.json({ checkout_id }, { status: 201 });
    }),

    http.get(`${BASE_URL}/checkouts/:checkoutId/coupons/discount-preview`, ({ params, request }) => {
      const id = Number(params.checkoutId);
      const state = checkouts.get(id);
      if (!state) {
        return errorResponse("CHECKOUT_NOT_FOUND", "주문을 찾을 수 없습니다.", 404);
      }
      const url = new URL(request.url);
      const couponIds = url.searchParams.getAll("couponIds").map(Number);
      return HttpResponse.json({ coupon_discount: calcCouponDiscount(couponIds, state.items, state.remoteArea) });
    }),

    http.get(`${BASE_URL}/checkouts/:checkoutId`, ({ params }) => {
      const id = Number(params.checkoutId);
      const state = checkouts.get(id);
      if (!state) {
        return errorResponse("CHECKOUT_NOT_FOUND", "주문을 찾을 수 없습니다.", 404);
      }
      return HttpResponse.json(buildCheckoutResponse(state));
    }),

    http.patch(`${BASE_URL}/checkouts/:checkoutId/address`, async ({ params, request }) => {
      const id = Number(params.checkoutId);
      const state = checkouts.get(id);
      if (!state) {
        return errorResponse("CHECKOUT_NOT_FOUND", "주문을 찾을 수 없습니다.", 404);
      }
      const body = (await request.json()) as { remote_area?: boolean };
      state.remoteArea = Boolean(body.remote_area);
      return new HttpResponse(null, { status: 204 });
    }),

    http.patch(`${BASE_URL}/checkouts/:checkoutId/coupons`, async ({ params, request }) => {
      const id = Number(params.checkoutId);
      const state = checkouts.get(id);
      if (!state) {
        return errorResponse("CHECKOUT_NOT_FOUND", "주문을 찾을 수 없습니다.", 404);
      }
      const body = (await request.json()) as { coupons?: number[] | null };
      state.selectedCouponIds = body.coupons ?? [];
      return new HttpResponse(null, { status: 204 });
    }),

    http.post(`${BASE_URL}/checkouts/:checkoutId/payment`, async ({ params, request }) => {
      const id = Number(params.checkoutId);
      const state = checkouts.get(id);
      if (!state) {
        return errorResponse("CHECKOUT_NOT_FOUND", "주문을 찾을 수 없습니다.", 404);
      }
      const body = (await request.json()) as { remote_area?: boolean; coupons?: number[] | null };
      state.remoteArea = Boolean(body.remote_area);
      state.selectedCouponIds = body.coupons ?? [];

      const response = buildCheckoutResponse(state);
      return HttpResponse.json({
        item_count: state.items.length,
        total_quantity: state.items.reduce((sum, item) => sum + item.quantity, 0),
        total_amount: response.total_amount,
      });
    }),

    http.delete(`${BASE_URL}/checkouts/:checkoutId`, ({ params }) => {
      const id = Number(params.checkoutId);
      checkouts.delete(id);
      return new HttpResponse(null, { status: 204 });
    }),

    http.get(`${BASE_URL}/cart`, () => {
      const data = cartItems.map(({ id, productId, quantity }) => {
        const product = products.find((p) => p.id === productId)!;
        return {
          id,
          name: product.name,
          price: product.price,
          image_url: product.imageUrl,
          quantity,
          stock: product.stock,
          status: getCartItemStatus(quantity, product.stock),
        };
      });
      return HttpResponse.json({ data });
    }),

    http.patch(`${BASE_URL}/cart/:id`, async ({ params, request }) => {
      if (patchDelay) {
        await patchDelay.wait();
      }

      const id = Number(params.id);

      if (isNaN(id)) {
        return errorResponse("INVALID_CART_ITEM_ID", "장바구니 상품 ID는 숫자여야 합니다.", 400);
      }

      const body = (await request.json()) as { quantity?: unknown };
      const { quantity } = body;

      if (quantity === undefined || quantity === null || typeof quantity !== "number") {
        return errorResponse("REQUIRED_CART_ITEM_QUANTITY", "장바구니 상품 수량은 필수입니다.", 400);
      }

      if (quantity < 1) {
        return errorResponse("INVALID_CART_ITEM_QUANTITY", "장바구니 상품 수량은 1개 이상이어야 합니다.", 400);
      }

      const item = cartItems.find((item) => item.id === id);
      if (!item) {
        return errorResponse("CART_ITEM_NOT_FOUND", "장바구니 상품을 찾을 수 없습니다.", 404);
      }

      const product = products.find((p) => p.id === item.productId)!;
      if (quantity > product.stock && quantity > item.quantity) {
        return errorResponse("OUT_OF_STOCK", "요청한 수량이 현재 재고보다 많습니다.", 409);
      }

      item.quantity = quantity;
      return new HttpResponse(null, { status: 204 });
    }),

    http.delete(`${BASE_URL}/cart/:id`, ({ params }) => {
      const id = Number(params.id);

      if (isNaN(id)) {
        return errorResponse("INVALID_CART_ITEM_ID", "장바구니 상품 ID는 숫자여야 합니다.", 400);
      }

      const index = cartItems.findIndex((item) => item.id === id);
      if (index === -1) {
        return errorResponse("CART_ITEM_NOT_FOUND", "장바구니 상품을 찾을 수 없습니다.", 404);
      }

      cartItems.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }),
  ];
};

export const handlers = createHandlers();
