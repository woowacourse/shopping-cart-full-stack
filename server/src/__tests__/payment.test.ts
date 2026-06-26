import {
  calculateOrderPrice,
  calculateShippingFee,
} from '../domain/payment/payment.calculator.js';

describe('주문 금액 계산 (calculateOrderPrice)', () => {
  test('각 상품의 (단가 × 주문수량) 합을 반환한다.', () => {
    const orderPrice = calculateOrderPrice([
      { price: 5000, orderCount: 2 },
      { price: 10000, orderCount: 1 },
    ]);

    expect(orderPrice).toBe(20000);
  });

  test('상품이 없으면 0을 반환한다.', () => {
    expect(calculateOrderPrice([])).toBe(0);
  });
});

describe('배송비 계산 (calculateShippingFee)', () => {
  test('주문 금액이 100,000원 이상이면 무료(0원)다.', () => {
    expect(calculateShippingFee(100000)).toBe(0);
  });

  test('주문 금액이 100,000원 미만이면 3,000원이다.', () => {
    expect(calculateShippingFee(99999)).toBe(3000);
  });

  test('주문 금액이 0원이면 배송비도 0원이다.', () => {
    expect(calculateShippingFee(0)).toBe(0);
  });

  test('도서 산간 지역이면 기본 배송비에 3,000원이 가산된다.', () => {
    expect(calculateShippingFee(99999, true)).toBe(6000);
  });

  test('도서 산간 지역은 무료 배송(10만원 이상)이어도 추가 배송비가 부과된다.', () => {
    expect(calculateShippingFee(100000, true)).toBe(3000);
  });

  test('주문 금액이 0원이면 도서 산간이어도 배송비는 0원이다.', () => {
    expect(calculateShippingFee(0, true)).toBe(0);
  });
});
