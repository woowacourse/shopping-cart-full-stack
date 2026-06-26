import { http, HttpResponse } from 'msw';
import type { CartItem } from '../domain/Types';
import type { Coupon, PreorderResponse } from '@cart/shared';

let mockCartItems: CartItem[] = [
  {
    cartItemId: 1,
    quantity: 2,
    product: {
      productId: 1,
      name: '아메리카노',
      price: 4500,
      thumbnailUrl: 'https://media.sodagift.com/img/image/665587415880572.jpg',
    },
  },
  {
    cartItemId: 2,
    quantity: 1,
    product: {
      productId: 2,
      name: '바닐라 라떼',
      price: 5500,
      thumbnailUrl:
        'https://thebreadbag.co.kr/wp-content/uploads/2025/03/%EB%B9%B5%EB%B0%B1%ED%99%94%EC%A0%90_%EC%A0%95%EC%82%AC%EA%B0%81-1280x1280_0000s_0005_%EB%B0%B0%EB%AF%BC1280x960_%EC%9D%8C%EB%A3%8C_%EB%B3%B4%EC%A0%95%EB%B3%B8_0005_%EB%B0%94%EB%8B%90%EB%9D%BC%EB%9D%BC%EB%96%BC-%EB%B3%B5%EC%82%AC.jpg',
    },
  },
];

export const handlers = [
  http.get('http://localhost:3000/cart', () => {
    return HttpResponse.json(mockCartItems);
  }),

  http.patch(
    'http://localhost:3000/cart/:cartItemId',
    async ({ params, request }) => {
      const { cartItemId } = params;
      const body = (await request.json()) as { quantity: number };

      const targetIndex = mockCartItems.findIndex(
        (item) => item.cartItemId === Number(cartItemId),
      );
      if (targetIndex === -1) return new HttpResponse(null, { status: 404 });

      mockCartItems[targetIndex].quantity = body.quantity;
      return HttpResponse.json(mockCartItems[targetIndex]);
    },
  ),

  http.delete('http://localhost:3000/cart/:cartItemId', ({ params }) => {
    const { cartItemId } = params;
    mockCartItems = mockCartItems.filter(
      (item) => item.cartItemId !== Number(cartItemId),
    );

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`http://localhost:3000/preorder`, async () => {
    return HttpResponse.json(
      { preorderId: 'msw-test-preorder-id' },
      { status: 201 },
    );
  }),

  http.get(`http://localhost:3000/preorder/:preorderId`, () => {
    const mockPreorder: PreorderResponse = {
      preorderId: 'msw-test-preorder-id',
      items: [
        {
          productId: 1,
          name: 'MSW 테스트 상품',
          price: 30000,
          thumbnailUrl: 'https://example.com/test.jpg',
          quantity: 2,
        },
      ],
    };
    return HttpResponse.json(mockPreorder, { status: 200 });
  }),

  http.get(`http://localhost:3000/coupons`, () => {
    const mockCoupons: Coupon[] = [
      {
        couponId: 1,
        name: 'MSW 5,000원 할인',
        type: 'DISCOUNT',
        expirationDate: '2099-12-31',
        condition: { minOrderLimit: 0 },
        benefit: { discountAmount: 5000 },
      },
    ];
    return HttpResponse.json(mockCoupons, { status: 200 });
  }),

  http.post(`http://localhost:3000/orders`, async () => {
    
    mockCartItems[0].quantity = 99;
    mockCartItems[0].product.price = 99999;

    return HttpResponse.json(
      {
        message:
          '결제 요청 금액이 일치하지 않습니다. 그 사이 상품 가격이나 쿠폰 혜택이 변동되었을 수 있습니다.',
      },
      { status: 409 },
    );
  }),
];
