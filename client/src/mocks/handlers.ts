import { http, HttpResponse } from 'msw';

import type { CartItem } from '../entities/cart/types';

export const mockCartItems: CartItem[] = [
  {
    product: {
      id: 'product-a',
      name: '상품이름A',
      price: 35000,
      image: null,
    },
    quantity: 2,
    isSelected: true,
  },
  {
    product: {
      id: 'product-b',
      name: '상품이름B',
      price: 25000,
      image: null,
    },
    quantity: 2,
    isSelected: true,
  },
];

export const handlers = [
  http.get('/carts', () => {
    return HttpResponse.json(mockCartItems);
  }),

  http.patch('/carts/:id', async ({ request }) => {
    const body = (await request.json()) as {
      quantity?: number;
      isSelected?: boolean;
    };

    const hasValidQuantity = typeof body.quantity === 'number';
    const hasValidSelection = typeof body.isSelected === 'boolean';

    if (!hasValidQuantity && !hasValidSelection) {
      return HttpResponse.json(
        { message: '변경할 장바구니 상태가 올바르지 않습니다.' },
        { status: 400 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('/carts', async ({ request }) => {
    const body = (await request.json()) as { isSelected?: boolean };

    if (typeof body.isSelected !== 'boolean') {
      return HttpResponse.json(
        { message: '선택 상태가 올바르지 않습니다.' },
        { status: 400 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/orders', async ({ request }) => {
    const body = (await request.json()) as {
      items?: { productId: string; quantity: number }[];
    };

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return HttpResponse.json(
        { message: '유효하지 않은 형식입니다.' },
        { status: 400 },
      );
    }

    return HttpResponse.json({ id: 'order-1' }, { status: 201 });
  }),

  http.get('/orders/:id', () => {
    return HttpResponse.json({
      products: [
        {
          productId: 'product-a',
          name: '상품이름A',
          price: 35000,
          image: null,
          quantity: 2,
        },
        {
          productId: 'product-b',
          name: '상품이름B',
          price: 25000,
          image: null,
          quantity: 2,
        },
      ],
      isRemoteArea: false,
      amount: {
        orderAmount: 120000,
        discountAmount: 5000,
        shippingFee: 0,
        totalAmount: 115000,
      },
    });
  }),

  http.get('/orders/:id/coupons', () => {
    return HttpResponse.json([
      {
        id: 'FIXED5000',
        isSelected: true,
        isDisabled: false,
        name: '5,000원 할인 쿠폰',
        dueDate: '2026-11-30',
        minOrderAmount: 100000,
      },
      {
        id: 'BOGO',
        isSelected: false,
        isDisabled: true,
        name: '2개 구매 시 1개 무료 쿠폰',
        dueDate: '2026-06-30',
      },
      {
        id: 'FREESHIPPING',
        isSelected: false,
        isDisabled: false,
        name: '5만원 이상 구매 시 무료 배송 쿠폰',
        dueDate: '2026-08-31',
        minOrderAmount: 50000,
      },
      {
        id: 'MIRACLESALE',
        isSelected: false,
        isDisabled: true,
        name: '미라클모닝 30% 할인 쿠폰',
        dueDate: '2026-07-31',
        availableTime: {
          startTime: '04:00',
          endTime: '07:00',
        },
      },
    ]);
  }),

  http.post('/orders/:id/coupons/discount', async ({ request }) => {
    const body = (await request.json()) as { coupons?: string[] };

    return HttpResponse.json({
      discountAmount: (body.coupons?.length ?? 0) * 5000,
    });
  }),

  http.patch('/orders/:id/coupons', async ({ request }) => {
    const body = (await request.json()) as { coupons?: string[] };

    if (!Array.isArray(body.coupons)) {
      return HttpResponse.json(
        { message: '유효하지 않은 형식입니다.' },
        { status: 400 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('/orders/:id', async ({ request }) => {
    const body = (await request.json()) as { isRemoteArea?: boolean };

    if (typeof body.isRemoteArea !== 'boolean') {
      return HttpResponse.json(
        { message: '유효하지 않은 형식입니다.' },
        { status: 400 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete('/carts/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
