import OrderSheet from '../models/OrderSheet.js';
import {
  calculateOrderAmount,
  calculateShippingFee,
  createPricingContext,
} from '../services/orderSheetPricing.js';

describe('orderSheetPricing tests', () => {
  test('주문 금액을 계산한다.', () => {
    const orderSheet = new OrderSheet('user-1', [
      {
        product: {
          id: 'product-1',
          name: '피자',
          price: 30000,
          thumbnail: 'pizza.png',
        },
        quantity: 2,
      },
      {
        product: {
          id: 'product-2',
          name: '치킨',
          price: 20000,
          thumbnail: 'chicken.png',
        },
        quantity: 1,
      },
    ]);

    expect(calculateOrderAmount(orderSheet)).toBe(80000);
  });

  test('주문 금액이 무료 배송 기준보다 작으면 배송비를 부과한다.', () => {
    expect(calculateShippingFee(60000, false)).toBe(3000);
  });

  test('도서산간 지역이면 추가 배송비를 부과한다.', () => {
    expect(calculateShippingFee(60000, true)).toBe(6000);
  });

  test('도서산간 지역도 무료 배송 기준 이상이면 배송비를 부과하지 않는다.', () => {
    expect(calculateShippingFee(100000, true)).toBe(0);
  });

  test('쿠폰 계산에 필요한 가격 컨텍스트를 만든다.', () => {
    const orderSheet = new OrderSheet('user-1', [
      {
        product: {
          id: 'product-1',
          name: '피자',
          price: 30000,
          thumbnail: 'pizza.png',
        },
        quantity: 2,
      },
    ]);

    const context = createPricingContext(orderSheet);

    expect(context.orderSheet).toBe(orderSheet);
    expect(context.orderAmount).toBe(60000);
    expect(context.shippingFee).toBe(3000);
    expect(context.now).toBeInstanceOf(Date);
  });
});
