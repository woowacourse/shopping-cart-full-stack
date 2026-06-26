import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:3000';
const FREE_DELIVERY_THRESHOLD = 100000;
const DELIVERY_FEE = 3000;
const REMOTE_AREA_EXTRA_FEE = 3000;

const PLACEHOLDER_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112'%3E%3Crect width='112' height='112' fill='%23e5e7eb'/%3E%3C/svg%3E";

// ─── 내부 타입 ────────────────────────────────────────────────────────────────

interface ProductData {
    id: string;
    name: string;
    price: number;
    imgUrl: string;
}

interface CartItemData {
    product: ProductData;
    quantity: number;
    checkStatus: boolean;
}

interface OrderCheckData {
    products: (ProductData & { quantity: number })[];
    remoteAreaCheckStatus: boolean;
    selectedCouponIds: string[];
}

type CouponDescription =
    | { type: 'EXPIRY_DATE'; content: { expiresAt: string } }
    | { type: 'MIN_ORDER_AMOUNT'; content: { minAmount: number } }
    | { type: 'USABLE_TIME'; content: { from: string; to: string } }
    | { type: 'MIN_QUANTITY_PER_PRODUCT'; content: { minQuantity: number } };

interface CouponRecord {
    couponId: string;
    couponTitle: string;
    minOrderAmount: number;
    discountType: 'FIXED' | 'PERCENTAGE' | 'BOGO' | 'FREE_SHIPPING';
    discountValue: number;
    description: CouponDescription[];
}

// ─── 초기 데이터 ──────────────────────────────────────────────────────────────

const INITIAL_PRODUCTS: ProductData[] = [
    { id: '1', price: 18000, name: 'Shopping Basket', imgUrl: PLACEHOLDER_IMG },
    { id: '2', price: 32000, name: 'Tote Bag', imgUrl: PLACEHOLDER_IMG },
    { id: '3', price: 9900, name: 'Reusable Cup', imgUrl: PLACEHOLDER_IMG },
];

const COUPON_RECORDS: CouponRecord[] = [
    {
        couponId: 'FIXED5000',
        couponTitle: '5,000원 할인 쿠폰',
        minOrderAmount: 100000,
        discountType: 'FIXED',
        discountValue: 5000,
        description: [
            { type: 'EXPIRY_DATE', content: { expiresAt: '2026-11-30' } },
            { type: 'MIN_ORDER_AMOUNT', content: { minAmount: 100000 } },
        ],
    },
    {
        couponId: 'BOGO',
        couponTitle: '2개 구매 시 1개 무료 쿠폰',
        minOrderAmount: 0,
        discountType: 'BOGO',
        discountValue: 0,
        description: [
            { type: 'MIN_QUANTITY_PER_PRODUCT', content: { minQuantity: 2 } },
            { type: 'EXPIRY_DATE', content: { expiresAt: '2026-06-30' } },
        ],
    },
    {
        couponId: 'FREESHIPPING',
        couponTitle: '5만원 이상 구매 시 무료 배송 쿠폰',
        minOrderAmount: 50000,
        discountType: 'FREE_SHIPPING',
        discountValue: 0,
        description: [
            { type: 'MIN_ORDER_AMOUNT', content: { minAmount: 50000 } },
            { type: 'EXPIRY_DATE', content: { expiresAt: '2026-08-31' } },
        ],
    },
    {
        couponId: 'MIRACLESALE',
        couponTitle: '미라클모닝 30% 할인 쿠폰',
        minOrderAmount: 0,
        discountType: 'PERCENTAGE',
        discountValue: 0.3,
        description: [
            { type: 'USABLE_TIME', content: { from: '04:00', to: '07:00' } },
            { type: 'EXPIRY_DATE', content: { expiresAt: '2026-07-31' } },
        ],
    },
];

// ─── 가변 상태 ────────────────────────────────────────────────────────────────

let products: ProductData[] = INITIAL_PRODUCTS.map((p) => ({ ...p }));
let cartItems: CartItemData[] = [
    { product: products[0], quantity: 2, checkStatus: true },
    { product: products[2], quantity: 1, checkStatus: true },
];
let orderCheck: OrderCheckData | null = null;
let nextProductId = 4;

export const resetStore = () => {
    products = INITIAL_PRODUCTS.map((p) => ({ ...p }));
    cartItems = [
        { product: products[0], quantity: 2, checkStatus: true },
        { product: products[2], quantity: 1, checkStatus: true },
    ];
    orderCheck = null;
    nextProductId = 4;
};

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────

const ok = <T>(data: T, status = 200) => HttpResponse.json({ status, data }, { status });

const fail = (status: number, errorCode: string, errorMessage: string) =>
    HttpResponse.json({ status, errorCode, errorMessage }, { status });

const computeCartPayInfo = (items: CartItemData[]) => {
    const orderPrice = items.filter((i) => i.checkStatus).reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const deliveryFee = orderPrice > 0 && orderPrice < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
    return { orderPrice, deliveryFee, totalOrderAmount: orderPrice + deliveryFee };
};

const computeBogoDiscount = (products: OrderCheckData['products']): number => {
    // BOGO 쿠폰: minQuantityPerProduct=2, getPerProduct=1 → 3개 이상 구매 상품 중 최고가 1개 무료
    const eligible = products.filter((p) => p.quantity >= 3);
    if (eligible.length === 0) return 0;
    return Math.max(...eligible.map((p) => p.price));
};

const computeOrderCheckPayInfo = (data: OrderCheckData) => {
    const orderPrice = data.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const baseDeliveryFee = orderPrice > 0 && orderPrice < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
    const remoteAreaFee = orderPrice > 0 && data.remoteAreaCheckStatus ? REMOTE_AREA_EXTRA_FEE : 0;
    const deliveryFee = baseDeliveryFee + remoteAreaFee;

    const fixedDiscount = data.selectedCouponIds.includes('FIXED5000') && orderPrice >= 100000 ? 5000 : 0;
    const percentDiscount = data.selectedCouponIds.includes('MIRACLESALE')
        ? Math.floor((orderPrice - fixedDiscount) * 0.3)
        : 0;
    const bogoDiscount = data.selectedCouponIds.includes('BOGO') ? computeBogoDiscount(data.products) : 0;
    const shippingDiscount = data.selectedCouponIds.includes('FREESHIPPING') && orderPrice >= 50000 ? deliveryFee : 0;

    const couponDiscountAmount = fixedDiscount + percentDiscount + bogoDiscount + shippingDiscount;

    return {
        orderPrice,
        deliveryFee,
        couponDiscountAmount,
        totalOrderAmount: orderPrice + deliveryFee - couponDiscountAmount,
    };
};

const computeDiscountAmount = (selectedCouponIds: string[], data: OrderCheckData): number => {
    const orderPrice = data.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const baseDeliveryFee = orderPrice > 0 && orderPrice < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
    const remoteAreaFee = orderPrice > 0 && data.remoteAreaCheckStatus ? REMOTE_AREA_EXTRA_FEE : 0;
    const deliveryFee = baseDeliveryFee + remoteAreaFee;

    const fixedDiscount = selectedCouponIds.includes('FIXED5000') && orderPrice >= 100000 ? 5000 : 0;
    const percentDiscount = selectedCouponIds.includes('MIRACLESALE')
        ? Math.floor((orderPrice - fixedDiscount) * 0.3)
        : 0;
    const bogoDiscount = selectedCouponIds.includes('BOGO') ? computeBogoDiscount(data.products) : 0;
    const shippingDiscount = selectedCouponIds.includes('FREESHIPPING') && orderPrice >= 50000 ? deliveryFee : 0;

    return fixedDiscount + percentDiscount + bogoDiscount + shippingDiscount;
};

const computeBestCouponIds = (data: OrderCheckData): string[] => {
    const orderPrice = data.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const validIds = COUPON_RECORDS.filter((r) => orderPrice >= r.minOrderAmount).map((r) => r.couponId);

    const combinations: string[][] = [[]];
    for (let i = 0; i < validIds.length; i++) {
        combinations.push([validIds[i]]);
        for (let j = i + 1; j < validIds.length; j++) {
            combinations.push([validIds[i], validIds[j]]);
        }
    }

    return combinations.reduce((best, combo) =>
        computeDiscountAmount(combo, data) > computeDiscountAmount(best, data) ? combo : best
    );
};

const toCouponDto = (record: CouponRecord, orderPrice: number) => ({
    couponId: record.couponId,
    couponTitle: record.couponTitle,
    disabled: orderPrice < record.minOrderAmount,
    description: record.description,
});

// ─── 핸들러 ──────────────────────────────────────────────────────────────────

export const handlers = [
    // ── Products ──────────────────────────────────────────────────────────────

    http.get(`${BASE_URL}/products`, () => {
        return ok({ products });
    }),

    http.post(`${BASE_URL}/products`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        const { name, price, imgUrl } = body;

        if (typeof name !== 'string' || typeof price !== 'number' || typeof imgUrl !== 'string') {
            return fail(400, 'TYPE_MISMATCH', '타입이 일치하지 않습니다.');
        }

        const newProduct: ProductData = { id: String(nextProductId++), name, price, imgUrl };
        products.push(newProduct);
        return ok(newProduct, 201);
    }),

    http.delete(`${BASE_URL}/products/:productId`, ({ params }) => {
        const { productId } = params as { productId: string };
        const index = products.findIndex((p) => p.id === productId);

        if (index === -1) return fail(404, 'RESOURCE_NOT_FOUND', '존재하지 않는 상품입니다.');

        products.splice(index, 1);
        return ok({ id: productId });
    }),

    // ── Cart ──────────────────────────────────────────────────────────────────

    http.post(`${BASE_URL}/cart`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        const { productId, quantity } = body;

        if (typeof productId !== 'string' || typeof quantity !== 'number') {
            return fail(400, 'TYPE_MISMATCH', '타입이 일치하지 않습니다.');
        }

        const product = products.find((p) => p.id === productId);
        if (!product) return fail(404, 'RESOURCE_NOT_FOUND', '존재하지 않는 상품입니다.');

        const existing = cartItems.find((i) => i.product.id === productId);
        if (existing) {
            existing.quantity = quantity;
            return ok({ product, quantity, checkStatus: existing.checkStatus }, 201);
        }

        const newItem: CartItemData = { product, quantity, checkStatus: true };
        cartItems.push(newItem);
        return ok({ product, quantity, checkStatus: true }, 201);
    }),

    http.get(`${BASE_URL}/cart`, () => {
        const isAllSelected = cartItems.length > 0 && cartItems.every((i) => i.checkStatus);
        return ok({
            isAllSelected,
            cartItems: cartItems.map((i) => ({ product: i.product, quantity: i.quantity, checkStatus: i.checkStatus })),
            payInfo: computeCartPayInfo(cartItems),
        });
    }),

    http.get(`${BASE_URL}/cart/pay-info`, () => {
        return ok(computeCartPayInfo(cartItems));
    }),

    http.patch(`${BASE_URL}/carts/select/product/:productId`, async ({ params, request }) => {
        const { productId } = params as { productId: string };
        const body = (await request.json()) as Record<string, unknown>;

        const item = cartItems.find((i) => i.product.id === productId);
        if (!item) return fail(404, 'RESOURCE_NOT_FOUND', '존재하지 않는 장바구니 상품입니다.');

        item.checkStatus = body.checkStatus as boolean;
        const isAllSelected = cartItems.every((i) => i.checkStatus);
        return ok({
            isAllSelected,
            cartItem: { product: item.product, quantity: item.quantity, checkStatus: item.checkStatus },
        });
    }),

    http.patch(`${BASE_URL}/carts/select`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        cartItems.forEach((i) => {
            i.checkStatus = body.checkStatus as boolean;
        });
        return ok({
            isAllSelected: body.checkStatus as boolean,
            cartItems: cartItems.map((i) => ({ product: i.product, quantity: i.quantity, checkStatus: i.checkStatus })),
        });
    }),

    http.patch(`${BASE_URL}/carts/products/:productId`, async ({ params, request }) => {
        const { productId } = params as { productId: string };
        const body = (await request.json()) as Record<string, unknown>;

        const item = cartItems.find((i) => i.product.id === productId);
        if (!item) return fail(404, 'RESOURCE_NOT_FOUND', '존재하지 않는 장바구니 상품입니다.');

        item.quantity = body.quantity as number;
        return ok({ product: item.product, quantity: item.quantity, checkStatus: item.checkStatus });
    }),

    http.delete(`${BASE_URL}/cart/product/:productId`, ({ params }) => {
        const { productId } = params as { productId: string };
        const index = cartItems.findIndex((i) => i.product.id === productId);

        if (index === -1) return fail(404, 'RESOURCE_NOT_FOUND', '존재하지 않는 장바구니 상품입니다.');

        cartItems.splice(index, 1);
        return ok({ deletedProductId: productId });
    }),

    // ── OrderCheck ────────────────────────────────────────────────────────────

    http.post(`${BASE_URL}/order-check`, () => {
        const selectedProducts = cartItems
            .filter((i) => i.checkStatus)
            .map((i) => ({ ...i.product, quantity: i.quantity }));

        orderCheck = { products: selectedProducts, remoteAreaCheckStatus: false, selectedCouponIds: [] };
        return ok({ products: selectedProducts }, 201);
    }),

    http.get(`${BASE_URL}/order-check`, () => {
        const data = orderCheck ?? { products: [], remoteAreaCheckStatus: false, selectedCouponIds: [] };
        return ok({ products: data.products, payInfo: computeOrderCheckPayInfo(data) });
    }),

    http.get(`${BASE_URL}/order-check/pay-info`, () => {
        if (!orderCheck) return fail(404, 'RESOURCE_NOT_FOUND', '주문 정보가 없습니다.');
        return ok(computeOrderCheckPayInfo(orderCheck));
    }),

    http.patch(`${BASE_URL}/order-check/select/remote-areas`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        if (!orderCheck) return fail(404, 'RESOURCE_NOT_FOUND', '주문 정보가 없습니다.');

        orderCheck.remoteAreaCheckStatus = body.checkStatus as boolean;
        return ok({ checkStatus: orderCheck.remoteAreaCheckStatus });
    }),

    http.get(`${BASE_URL}/order-check/coupons`, () => {
        const data = orderCheck ?? { products: [], remoteAreaCheckStatus: false, selectedCouponIds: [] };
        const orderPrice = data.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
        const selectedCoupons =
            data.selectedCouponIds.length > 0 ? data.selectedCouponIds : computeBestCouponIds(data);

        return ok({
            coupons: COUPON_RECORDS.map((r) => toCouponDto(r, orderPrice)),
            selectedCoupons,
        });
    }),

    http.patch(`${BASE_URL}/order-check/coupons`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        if (orderCheck) orderCheck.selectedCouponIds = body.selectedCouponId as string[];
        return new HttpResponse(null, { status: 204 });
    }),

    http.post(`${BASE_URL}/order-check/coupons`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        const selectedCouponId = body.selectedCouponId as string[];
        const data = orderCheck ?? { products: [], remoteAreaCheckStatus: false, selectedCouponIds: [] };

        return ok({ discountAmount: computeDiscountAmount(selectedCouponId, data) });
    }),
];
