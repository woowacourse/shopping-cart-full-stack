import {calculateOrderAmount, calculateShippingFee} from '../orderPolicy.js';
import type {PreorderItem} from '../../../types/preorder.js';

const items: PreorderItem[] = [
  {
    productId: 'product-1',
    name: '상품A',
    imageUrl: '/product-a.png',
    price: 10000,
    quantity: 2,
  },
  {
    productId: 'product-2',
    name: '상품B',
    imageUrl: '/product-b.png',
    price: 30000,
    quantity: 1,
  },
];

describe('orderPolicy', () => {
  test('상품 가격과 수량으로 주문 금액을 계산한다', () => {
    expect(calculateOrderAmount(items)).toBe(50000);
  });

  test('무료 배송 기준 미만이면 기본 배송비를 계산한다', () => {
    expect(calculateShippingFee(99999, false)).toBe(3000);
  });

  test('무료 배송 기준 이상이면 기본 배송비는 0원이다', () => {
    expect(calculateShippingFee(100000, false)).toBe(0);
  });

  test('도서산간 지역이면 추가 배송비를 더한다', () => {
    expect(calculateShippingFee(100000, true)).toBe(3000);
  });
});
