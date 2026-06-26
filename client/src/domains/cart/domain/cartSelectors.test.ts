import {
  getSelectedItemCount,
  getSelectedOrderAmount,
  getSelectedQuantity,
  getShippingFee,
  getTotalPrice,
} from './cartSelectors.js';
import type {CartItem} from './types.js';

const cartItems: CartItem[] = [
  {
    id: 'cart-1',
    productInfo: {id: 'product-hoodie', name: '후드 집업', price: 10000, imageUrl: '/hoodie.png'},
    quantity: 2,
  },
  {
    id: 'cart-2',
    productInfo: {id: 'product-denim', name: '데님 팬츠', price: 30000, imageUrl: '/denim-pants.png'},
    quantity: 1,
  },
  {
    id: 'cart-3',
    productInfo: {id: 'product-sneakers', name: '스니커즈', price: 50000, imageUrl: '/sneakers.png'},
    quantity: 3,
  },
];

const cartSelection = {
  items: cartItems,
  selectedIds: ['cart-1', 'cart-2'],
};

describe('cartSelectors', () => {
  test('선택한 상품의 주문 금액을 계산한다', () => {
    expect(getSelectedOrderAmount(cartSelection)).toBe(50000);
  });

  test('선택한 상품이 없으면 주문 금액과 배송비가 0원이다', () => {
    const selection = {...cartSelection, selectedIds: []};

    expect(getSelectedOrderAmount(selection)).toBe(0);
    expect(getShippingFee(selection)).toBe(0);
    expect(getTotalPrice(selection)).toBe(0);
  });

  test('주문 금액이 무료 배송 기준 미만이면 배송비를 더한다', () => {
    const selection = {...cartSelection, selectedIds: ['cart-1']};

    expect(getShippingFee(selection)).toBe(3000);
    expect(getTotalPrice(selection)).toBe(23000);
  });

  test('주문 금액이 무료 배송 기준과 같으면 배송비는 0원이다', () => {
    const selection = {
      ...cartSelection,
      selectedIds: ['cart-3'],
      items: cartItems.map((item) => {
        if (item.id !== 'cart-3') return item;

        return {...item, quantity: 2};
      }),
    };

    expect(getShippingFee(selection)).toBe(0);
    expect(getTotalPrice(selection)).toBe(100000);
  });

  test('주문 금액이 무료 배송 기준 이상이면 배송비는 0원이다', () => {
    const selection = {...cartSelection, selectedIds: ['cart-2', 'cart-3']};

    expect(getShippingFee(selection)).toBe(0);
    expect(getTotalPrice(selection)).toBe(180000);
  });

  test('선택한 상품 종류 수와 수량 합계를 계산한다', () => {
    const selection = {...cartSelection, selectedIds: ['cart-1', 'cart-3']};

    expect(getSelectedItemCount(selection)).toBe(2);
    expect(getSelectedQuantity(selection)).toBe(5);
  });
});
