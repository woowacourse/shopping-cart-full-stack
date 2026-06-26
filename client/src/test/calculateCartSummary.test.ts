import { describe, expect, test } from 'vitest';
import type { CartItemResponse } from '../apis/cart';
import { calCartSummary } from '../cart/utils/calculateCartSummary';

const cartItems: CartItemResponse[] = [
  {
    product: {
      id: 'product-1',
      name: '운동화',
      price: 30_000,
      thumbnail: 'https://placehold.co/211x211?text=Sneakers',
    },
    quantity: 2,
  },
  {
    product: {
      id: 'product-2',
      name: '양말',
      price: 10_000,
      thumbnail: 'https://placehold.co/211x211?text=Socks',
    },
    quantity: 1,
  },
];

describe('calCartSummary', () => {
  test('선택된 상품들의 주문 금액과 총 결제 금액을 계산한다.', () => {
    const result = calCartSummary(cartItems, ['product-1', 'product-2']);

    expect(result).toEqual({
      orderAmount: 70_000,
      shippingFee: 3_000,
      totalPaymentAmount: 73_000,
    });
  });

  test('선택되지 않은 상품은 주문 금액 계산에서 제외한다.', () => {
    const result = calCartSummary(cartItems, ['product-2']);

    expect(result).toEqual({
      orderAmount: 10_000,
      shippingFee: 3_000,
      totalPaymentAmount: 13_000,
    });
  });

  test('주문 금액이 100,000원 이상이면 배송비를 0원으로 계산한다.', () => {
    const result = calCartSummary(
      [
        {
          product: {
            id: 'product-1',
            name: '운동화',
            price: 50_000,
            thumbnail: 'https://placehold.co/211x211?text=Sneakers',
          },
          quantity: 2,
        },
      ],
      ['product-1'],
    );

    expect(result).toEqual({
      orderAmount: 100_000,
      shippingFee: 0,
      totalPaymentAmount: 100_000,
    });
  });

  test('선택된 상품이 없으면 주문 금액을 0원으로 계산한다.', () => {
    const result = calCartSummary(cartItems, []);

    expect(result).toEqual({
      orderAmount: 0,
      shippingFee: 0,
      totalPaymentAmount: 0,
    });
  });
});
