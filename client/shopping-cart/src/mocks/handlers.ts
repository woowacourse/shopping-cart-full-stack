import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:3000';

/**
 * STEP3 API 명세(docs/STEP3/API.md) 기준 MSW 목업.
 * 상품 / 장바구니 / 주문 확인 / 쿠폰 도메인을 다룬다.
 */

type Product = {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
};

type StoredCartItem = {
  product: Product;
  quantity: number;
  checkStatus: boolean;
};

type CouponDescription =
  | { type: 'EXPIRY_DATE'; content: { expiresAt: string } }
  | { type: 'MIN_ORDER_AMOUNT'; content: { minAmount: number } }
  | { type: 'USABLE_TIME'; content: { from: string; to: string } }
  | { type: 'MIN_QUANTITY_PER_PRODUCT'; content: { minQuantity: number } };

type Coupon = {
  couponId: string;
  couponTitle: string;
  disabled: boolean;
  description: CouponDescription[];
};

const FREE_SHIPPING_THRESHOLD = 100000;
const DELIVERY_FEE = 3000;
const REMOTE_AREA_EXTRA_FEE = 3000;

let products: Product[] = [
  {
    id: '1',
    name: '데일리 라운드 티셔츠',
    price: 10000,
    imgUrl: 'https://picsum.photos/seed/cart-item-1/150',
  },
  {
    id: '2',
    name: '와이드 데님 팬츠',
    price: 20000,
    imgUrl: 'https://picsum.photos/seed/cart-item-2/150',
  },
  {
    id: '3',
    name: '아주 긴 이름의 프리미엄 코튼 오버핏 셔츠',
    price: 32000,
    imgUrl: 'https://picsum.photos/seed/cart-item-3/150',
  },
];

let cartItems: StoredCartItem[] = [
  { product: products[0], quantity: 2, checkStatus: true },
  { product: products[1], quantity: 1, checkStatus: true },
  { product: products[2], quantity: 4, checkStatus: false },
];

const coupons: Coupon[] = [
  {
    couponId: 'FIXED5000',
    couponTitle: '5,000원 할인 쿠폰',
    disabled: false,
    description: [
      { type: 'MIN_ORDER_AMOUNT', content: { minAmount: 100000 } },
      { type: 'EXPIRY_DATE', content: { expiresAt: '2026-11-30' } },
    ],
  },
  {
    couponId: 'BOGO',
    couponTitle: '2+1 쿠폰',
    disabled: true,
    description: [
      { type: 'MIN_QUANTITY_PER_PRODUCT', content: { minQuantity: 2 } },
      { type: 'EXPIRY_DATE', content: { expiresAt: '2026-06-30' } },
    ],
  },
  {
    couponId: 'FREESHIPPING',
    couponTitle: '무료 배송 쿠폰',
    disabled: false,
    description: [
      { type: 'MIN_ORDER_AMOUNT', content: { minAmount: 50000 } },
      { type: 'EXPIRY_DATE', content: { expiresAt: '2026-08-31' } },
    ],
  },
  {
    couponId: 'MIRACLESALE',
    couponTitle: '30% 시간제 할인 쿠폰',
    disabled: false,
    description: [
      { type: 'USABLE_TIME', content: { from: '04:00', to: '07:00' } },
      { type: 'EXPIRY_DATE', content: { expiresAt: '2026-07-31' } },
    ],
  },
];

// POST /order-check 시점에 선택된(checkStatus: true) 장바구니 상품의 스냅샷. 생성 전이면 null.
let orderCheckItems: StoredCartItem[] | null = null;
let remoteAreaSelected = false;
let appliedCouponIds: string[] = [];

const success = <T>(data: T, status = 200) => HttpResponse.json({ status, data }, { status });

const fail = (status: number, errorCode: string, errorMessage: string, data?: unknown) =>
  HttpResponse.json({ status, errorCode, errorMessage, data }, { status });

const calcPayInfo = (items: StoredCartItem[]) => {
  const orderPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = orderPrice === 0 || orderPrice >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE;
  return { orderPrice, deliveryFee, totalOrderAmount: orderPrice + deliveryFee };
};

const calcPayInfoWithCoupon = (
  items: StoredCartItem[],
  appliedCouponIds: string[],
  isRemoteAreaSelected: boolean,
) => {
  const payInfo = calcPayInfo(items);
  const deliveryFee =
    payInfo.deliveryFee + (payInfo.orderPrice > 0 && isRemoteAreaSelected ? REMOTE_AREA_EXTRA_FEE : 0);
  const couponDiscountAmount = calcCouponDiscountAmount(appliedCouponIds, items);
  const totalOrderAmount = Math.max(payInfo.orderPrice + deliveryFee - couponDiscountAmount, 0);

  return { orderPrice: payInfo.orderPrice, deliveryFee, couponDiscountAmount, totalOrderAmount };
};

// 쿠폰 목록(coupons)은 클라이언트에 보여줄 표시용 정보만 담고 있어서,
// 할인액 계산에 필요한 내부 정보는 여기에 별도로 둔다.
type CouponCalcInfo =
  | { couponId: string; discountType: 'FIXED'; discountValue: number }
  | { couponId: string; discountType: 'PERCENTAGE'; discountValue: number }
  | {
      couponId: string;
      discountType: 'BOGO';
      minQuantityPerProduct: number;
      getPerProduct: number;
    }
  | { couponId: string; discountType: 'FREE_SHIPPING' };

const couponCalcInfos: CouponCalcInfo[] = [
  { couponId: 'FIXED5000', discountType: 'FIXED', discountValue: 5000 },
  { couponId: 'BOGO', discountType: 'BOGO', minQuantityPerProduct: 2, getPerProduct: 1 },
  { couponId: 'FREESHIPPING', discountType: 'FREE_SHIPPING' },
  { couponId: 'MIRACLESALE', discountType: 'PERCENTAGE', discountValue: 0.3 },
];

const couponApplicationPriority: Record<CouponCalcInfo['discountType'], number> = {
  FIXED: 1,
  BOGO: 1,
  PERCENTAGE: 2,
  FREE_SHIPPING: 3,
};

const calcCouponDiscountAmount = (selectedCouponIds: string[], items: StoredCartItem[]) => {
  const payInfo = calcPayInfo(items);
  const selectedInfos = selectedCouponIds
    .map((couponId) => couponCalcInfos.find((info) => info.couponId === couponId))
    .filter((info): info is CouponCalcInfo => info !== undefined)
    .sort(
      (a, b) => couponApplicationPriority[a.discountType] - couponApplicationPriority[b.discountType],
    );

  let remainingOrderAmount = payInfo.orderPrice;
  let orderDiscountAmount = 0;
  let shippingDiscountAmount = 0;

  for (const info of selectedInfos) {
    if (info.discountType === 'FIXED') {
      const discount = Math.min(remainingOrderAmount, info.discountValue);
      remainingOrderAmount -= discount;
      orderDiscountAmount += discount;
    } else if (info.discountType === 'PERCENTAGE') {
      const discount = Math.floor(remainingOrderAmount * info.discountValue);
      remainingOrderAmount -= discount;
      orderDiscountAmount += discount;
    } else if (info.discountType === 'BOGO') {
      const minQuantity = info.minQuantityPerProduct + info.getPerProduct;
      const eligibleItems = items.filter((item) => item.quantity >= minQuantity);
      if (eligibleItems.length > 0) {
        const highestPrice = Math.max(...eligibleItems.map((item) => item.product.price));
        const discount = Math.min(remainingOrderAmount, highestPrice * info.getPerProduct);
        remainingOrderAmount -= discount;
        orderDiscountAmount += discount;
      }
    } else if (info.discountType === 'FREE_SHIPPING') {
      shippingDiscountAmount = payInfo.deliveryFee;
    }
  }

  return orderDiscountAmount + shippingDiscountAmount;
};

// body가 JSON 형식이 아니면 null을 반환해 NO_JSON 분기에서 쓰도록 한다.
const parseJsonBody = async (request: Request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

export const handlers = [
  // ------------------------------------------------------------------------
  // 상품 (Product)
  // ------------------------------------------------------------------------
  http.get(`${BASE_URL}/products`, () => success({ products })),

  http.post(`${BASE_URL}/products`, async ({ request }) => {
    const body = await parseJsonBody(request);
    if (body === null) return fail(400, 'NO_JSON', '요청 body가 JSON 형식이 아닙니다.');

    const missing = (['name', 'price', 'imgUrl'] as const).filter((key) => body[key] === undefined);
    if (missing.length > 0) {
      return fail(
        400,
        'MISSING_FIELD',
        '필수 필드가 누락되었습니다.',
        missing.map((type) => ({ type, errorCode: 'REQUIRED' })),
      );
    }

    const { name, price, imgUrl } = body;
    if (typeof name !== 'string' || typeof price !== 'number' || typeof imgUrl !== 'string') {
      return fail(400, 'TYPE_MISSMATCH', '필드 타입이 일치하지 않습니다.');
    }
    if (price <= 0) {
      return fail(400, 'INVALID', '가격은 0보다 커야 합니다.', [
        { type: 'price', errorCode: 'INVALID_RANGE' },
      ]);
    }

    const newProduct: Product = { id: String(products.length + 1), name, price, imgUrl };
    products = [...products, newProduct];
    return success(newProduct, 201);
  }),

  http.delete(`${BASE_URL}/products/:productId`, ({ params }) => {
    const productId = params.productId as string;
    const product = products.find((item) => item.id === productId);
    if (!product) return fail(404, 'ROUTE_NOT_FOUND', '존재하지 않는 상품입니다.');

    products = products.filter((item) => item.id !== productId);
    return success({ id: productId });
  }),

  // ------------------------------------------------------------------------
  // 장바구니 (Cart)
  // ------------------------------------------------------------------------
  http.get(`${BASE_URL}/cart`, () => {
    return success({
      isAllSelected: cartItems.every((item) => item.checkStatus),
      cartItems,
      payInfo: calcPayInfo(cartItems.filter((item) => item.checkStatus)),
    });
  }),

  http.get(`${BASE_URL}/cart/pay-info`, () => {
    return success(calcPayInfo(cartItems.filter((item) => item.checkStatus)));
  }),

  http.patch(`${BASE_URL}/carts/select/product/:productId`, async ({ params, request }) => {
    const productId = params.productId as string;
    const body = await parseJsonBody(request);
    if (body === null) return fail(400, 'NO_JSON', '요청 body가 JSON 형식이 아닙니다.');

    const cartItem = cartItems.find((item) => item.product.id === productId);
    if (!cartItem) return fail(404, 'ROUTE_NOT_FOUND', '존재하지 않는 상품입니다.');

    cartItem.checkStatus = Boolean(body.checkStatus);
    return success({
      isAllSelected: cartItems.every((item) => item.checkStatus),
      cartItem,
    });
  }),

  http.patch(`${BASE_URL}/carts/select`, async ({ request }) => {
    const body = await parseJsonBody(request);
    if (body === null) return fail(400, 'NO_JSON', '요청 body가 JSON 형식이 아닙니다.');

    const checkStatus = Boolean(body.checkStatus);
    cartItems = cartItems.map((item) => ({ ...item, checkStatus }));
    return success({ isAllSelected: checkStatus, cartItems });
  }),

  http.patch(`${BASE_URL}/carts/products/:productId`, async ({ params, request }) => {
    const productId = params.productId as string;
    const body = await parseJsonBody(request);
    if (body === null) return fail(400, 'NO_JSON', '요청 body가 JSON 형식이 아닙니다.');

    const { quantity } = body;
    if (quantity === undefined) {
      return fail(400, 'MISSING_FIELD', 'quantity가 누락되었습니다.', [
        { type: 'quantity', errorCode: 'REQUIRED' },
      ]);
    }
    if (typeof quantity !== 'number') {
      return fail(400, 'TYPE_MISSMATCH', 'quantity 타입이 일치하지 않습니다.');
    }
    if (quantity < 1 || quantity > 99) {
      return fail(400, 'INVALID', 'quantity는 1~99 사이여야 합니다.', [
        { type: 'quantity', errorCode: 'INVALID_RANGE' },
      ]);
    }

    const cartItem = cartItems.find((item) => item.product.id === productId);
    if (!cartItem) return fail(404, 'ROUTE_NOT_FOUND', '존재하지 않는 상품입니다.');

    cartItem.quantity = quantity;
    return success(cartItem);
  }),

  http.delete(`${BASE_URL}/cart/product/:productId`, ({ params }) => {
    const productId = params.productId as string;
    const cartItem = cartItems.find((item) => item.product.id === productId);
    if (!cartItem) return fail(404, 'ROUTE_NOT_FOUND', '존재하지 않는 상품입니다.');

    cartItems = cartItems.filter((item) => item.product.id !== productId);
    return success({ deletedProductId: productId });
  }),

  // ------------------------------------------------------------------------
  // 주문 확인 (Order Check)
  // ------------------------------------------------------------------------
  http.post(`${BASE_URL}/order-check`, () => {
    orderCheckItems = cartItems.filter((item) => item.checkStatus);
    return success(undefined, 201);
  }),

  http.get(`${BASE_URL}/order-check`, () => {
    const items = orderCheckItems ?? [];
    return success({
      products: items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        imgUrl: item.product.imgUrl,
        quantity: item.quantity,
      })),
      payInfo: calcPayInfoWithCoupon(items, appliedCouponIds, remoteAreaSelected),
    });
  }),

  http.get(`${BASE_URL}/order-check/pay-info`, () => {
    if (!orderCheckItems) return fail(404, 'RESOURCE_NOT_FOUND', '생성된 주문이 없습니다.');
    return success(calcPayInfoWithCoupon(orderCheckItems, appliedCouponIds, remoteAreaSelected));
  }),

  http.patch(`${BASE_URL}/order-check/select/remote-areas`, async ({ request }) => {
    if (!orderCheckItems) return fail(404, 'RESOURCE_NOT_FOUND', '생성된 주문이 없습니다.');

    const body = await parseJsonBody(request);
    if (body === null || body.checkStatus === undefined) {
      return fail(400, 'MISSING_FIELD', 'checkStatus가 누락되었습니다.', [
        { type: 'checkStatus', errorCode: 'REQUIRED' },
      ]);
    }

    remoteAreaSelected = Boolean(body.checkStatus);
    return success({ checkStatus: remoteAreaSelected });
  }),

  // ------------------------------------------------------------------------
  // 쿠폰 (Coupon)
  // ------------------------------------------------------------------------
  http.get(`${BASE_URL}/order-check/coupons`, () =>
    success({ coupons, selectedCoupons: appliedCouponIds }),
  ),

  http.patch(`${BASE_URL}/order-check/coupons`, async ({ request }) => {
    const body = await parseJsonBody(request);
    if (body === null) return fail(400, 'NO_JSON', '요청 body가 JSON 형식이 아닙니다.');

    const selectedCouponId: string[] = body.selectedCouponId ?? [];
    if (selectedCouponId.length > 2) {
      return fail(400, 'INVALID', '쿠폰은 최대 2개까지 선택할 수 있습니다.', {
        errorCode: 'INVALID_COUPON_COUNT',
      });
    }

    appliedCouponIds = selectedCouponId;
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${BASE_URL}/order-check/coupons`, async ({ request }) => {
    const body = await parseJsonBody(request);
    if (body === null) return fail(400, 'NO_JSON', '요청 body가 JSON 형식이 아닙니다.');

    const selectedCouponId: string[] | undefined = body.selectedCouponId;
    if (selectedCouponId === undefined) {
      return fail(400, 'MISSING_FIELD', 'selectedCouponId는 필수입니다.', [
        { type: 'selectedCouponId', errorCode: 'REQUIRED' },
      ]);
    }
    if (selectedCouponId.length > 2) {
      return fail(400, 'INVALID', '쿠폰은 최대 2개까지 선택할 수 있습니다.', {
        errorCode: 'INVALID_COUPON_COUNT',
      });
    }

    const items = orderCheckItems ?? [];
    return success({ discountAmount: calcCouponDiscountAmount(selectedCouponId, items) });
  }),
];
