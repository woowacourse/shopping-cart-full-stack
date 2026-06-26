import { HttpResponse, delay, http } from "msw";
export const API_BASE_URL =
  "https://shopping-cart-full-stack-production-0cf6.up.railway.app";

type MockProduct = {
  id: number;
  name: string;
  price: number;
  imgUrl: string | undefined;
  quantity: number;
};

type MockCartItem = {
  id: number;
  name: string;
  price: number;
  imgUrl: string | undefined;
  itemCount: number;
};

const initialMockProducts: MockProduct[] = [
  {
    id: 1,
    name: "테스트 상품 1",
    price: 10000,
    imgUrl: undefined,
    quantity: 10,
  },
  {
    id: 2,
    name: "테스트 상품 2",
    price: 20000,
    imgUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 5,
  },
];

const initialMockCartItems: MockCartItem[] = [
  {
    id: 1,
    name: "테스트 상품 1",
    price: 10000,
    imgUrl: undefined,
    itemCount: 1,
  },
  {
    id: 2,
    name: "테스트 상품 2",
    price: 10000,
    imgUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    itemCount: 2,
  },
];

export let mockProducts = structuredClone(initialMockProducts);
export let mockCartItems = structuredClone(initialMockCartItems);
let mockCartId = 1;

export const resetMockData = () => {
  mockProducts = structuredClone(initialMockProducts);
  mockCartItems = structuredClone(initialMockCartItems);
  mockCartId = 1;
};

const createSuccessResponse = <T>(result: T, status = 200) => {
  return HttpResponse.json(
    {
      code: status,
      message: "요청에 성공했습니다.",
      result,
    },
    { status },
  );
};

export const handlers = [
  http.get(`${API_BASE_URL}/products`, () => {
    return createSuccessResponse({
      products: mockProducts,
    });
  }),

  http.post(`${API_BASE_URL}/products`, async ({ request }) => {
    const product = (await request.json()) as Omit<MockProduct, "id">;
    const nextProduct = {
      id: Math.max(0, ...mockProducts.map(({ id }) => id)) + 1,
      ...product,
    };

    mockProducts.push(nextProduct);

    return createSuccessResponse({ id: nextProduct.id }, 201);
  }),

  http.delete(`${API_BASE_URL}/products/:productId`, ({ params }) => {
    const productId = Number(params.productId);
    mockProducts = mockProducts.filter(({ id }) => id !== productId);
    mockCartItems = mockCartItems.filter(({ id }) => id !== productId);

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_BASE_URL}/carts`, () => {
    mockCartId += 1;

    return createSuccessResponse({ id: mockCartId }, 201);
  }),

  http.get(`${API_BASE_URL}/carts/:cartId/items`, () => {
    return createSuccessResponse({
      cartItems: mockCartItems,
    });
  }),

  http.post(`${API_BASE_URL}/carts/:cartId/items`, async ({ request }) => {
    const { productId, itemCount } = (await request.json()) as {
      productId: number;
      itemCount: number;
    };
    const product = mockProducts.find(({ id }) => id === productId);

    if (!product) {
      return HttpResponse.json(
        {
          code: "PRODUCT_NOT_EXIST",
          message: "상품이 존재하지 않습니다.",
        },
        { status: 404 },
      );
    }

    const existingCartItem = mockCartItems.find(({ id }) => id === productId);

    if (existingCartItem) {
      existingCartItem.itemCount += itemCount;
    } else {
      mockCartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imgUrl: product.imgUrl,
        itemCount,
      });
    }

    return createSuccessResponse({ productId }, 201);
  }),

  http.patch(
    `${API_BASE_URL}/carts/:cartId/items/:productId`,
    async ({ params, request }) => {
      const productId = Number(params.productId);
      const { itemCount } = (await request.json()) as { itemCount: number };
      const cartItem = mockCartItems.find(({ id }) => id === productId);

      await delay(2000);
      if (!cartItem) {
        return HttpResponse.json(
          {
            code: "PRODUCT_NOT_EXIST_IN_CART",
            message: "해당 상품이 장바구니에 존재하지 않습니다.",
          },
          { status: 404 },
        );
      }

      cartItem.itemCount = itemCount;

      return createSuccessResponse({
        id: productId,
        itemCount,
      });
    },
  ),

  http.delete(
    `${API_BASE_URL}/carts/:cartId/items/:productId`,
    async ({ params }) => {
      const productId = Number(params.productId);
      mockCartItems = mockCartItems.filter(({ id }) => id !== productId);

      await delay(2000);
      return new HttpResponse(null, { status: 204 });
    },
  ),
  // 여기부터 checkout
  http.post(`${API_BASE_URL}/checkout`, async () => {
    await delay(3000);
    return createSuccessResponse({
      checkoutId: 1,
    });
  }),

  http.patch(
    `${API_BASE_URL}/checkout/:checkoutId/remote-area`,
    async ({ request }) => {
      const { nextRemoteArea } = (await request.json()) as {
        nextRemoteArea: boolean;
      };
      await delay(2000);
      return createSuccessResponse({
        remoteArea: nextRemoteArea,
        deliveryFee: 6000,
        couponDiscountPrice: 0,
        totalPrice: 61000,
      });
    },
  ),

  http.patch(
    `${API_BASE_URL}/checkout/:checkoutId/coupons`,
    async ({ request }) => {
      const { nextCouponIds } = (await request.json()) as {
        nextCouponIds: number[];
      };
      await delay(2000);
      return createSuccessResponse({
        appliedCouponIds: nextCouponIds,
        deliveryFee: 6000,
        couponDiscountPrice: 0,
        totalPrice: 61000,
      });
    },
  ),

  http.get(`${API_BASE_URL}/checkout/:checkoutId`, () => {
    return createSuccessResponse({
      checkoutId: 1,
      checkoutItems: [
        {
          id: 1,
          name: "나이키 양말",
          price: 5000,
          imgUrl: "https://sdasd.asdas.com",
          itemCount: 3,
        },
        {
          id: 2,
          name: "아디다스 신발",
          price: 50000,
          imgUrl: "https://sdasd.asdas.com",
          itemCount: 1,
        },
      ],
      appliedCouponIds: [],
      remoteArea: false,
      orderPrice: 55000,
      couponDiscountPrice: 0,
      deliveryFee: 3000,
      totalPrice: 58000,
    });
  }),

  http.get(`${API_BASE_URL}/checkout/:checkoutId/coupons`, () => {
    return createSuccessResponse({
      coupons: [
        {
          id: 1,
          name: "5,000원 할인 쿠폰",
          type: "FIXED5000",
          expiryDate: "2026-11-30",
          fixedDiscountPrice: 5000,
          fixedDiscountRate: null,
          minAmount: 100000,
          startTime: null,
          endTime: null,
          isAvailable: true,
        },
        {
          id: 2,
          name: "2+1 쿠폰",
          type: "BOGO",
          expiryDate: "2026-06-30",
          fixedDiscountPrice: null,
          fixedDiscountRate: null,
          minAmount: null,
          startTime: null,
          endTime: null,
          isAvailable: true,
        },
        {
          id: 3,
          name: "무료 배송 쿠폰",
          type: "FREESHIPPING",
          expiryDate: "2026-08-31",
          fixedDiscountPrice: null,
          fixedDiscountRate: null,
          minAmount: 50000,
          startTime: null,
          endTime: null,
          isAvailable: false,
        },
        {
          id: 4,
          name: "30% 시간제 할인 쿠폰",
          type: "MIRACLESALE",
          expiryDate: "2026-07-31",
          fixedDiscountPrice: null,
          fixedDiscountRate: 30,
          minAmount: null,
          startTime: "04:00",
          endTime: "07:00",
          isAvailable: true,
        },
      ],
      recommendedCouponIds: [1, 4],
    });
  }),
];
