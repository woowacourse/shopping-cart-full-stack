import { ModelError } from '../../../src/errors/ModelError.js';
import { Order } from '../../../src/modules/orders/orders.model.js';

describe('order model 테스트', () => {
  describe('주문 생성', () => {
    const order = new Order({
      orderId: 'order-1',
      products: [{ productId: 'product-1', quantity: 3 }],
      couponIds: ['coupon-5000'],
    });

    test('주문 id, 주문 상품 목록, 쿠폰 id 목록을 받아 인스턴스를 생성한다.', () => {
      expect(order.orderId).toEqual('order-1');
      expect(order.products.length).toEqual(1);
      expect(order.couponIds.length).toEqual(1);
    });

    test('생성 시 도서산간 지역 여부는 false이다', () => {
      expect(order.isIsland).toEqual(false);
    });
  });

  describe('주문 상품 검증', () => {
    test('주문 상품 목록이 비어 있으면 생성할 수 없다', () => {
      try {
        new Order({
          orderId: 'order-1',
          products: [],
          couponIds: ['coupon-5000'],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ModelError);
        expect((error as ModelError).code).toBe('EMPTY_ORDER_PRODUCTS');
      }
    });
  });

  describe('쿠폰 적용 상태 변경', () => {
    const order = new Order({
      orderId: 'order-1',
      products: [{ productId: 'product-1', quantity: 3 }],
      couponIds: [],
    });

    test('쿠폰 id 목록을 변경할 수 있다', () => {
      expect(order.couponIds).toEqual([]);

      order.changeCoupons(['coupon-5000', 'coupon-shipping']);
      expect(order.couponIds).toEqual(['coupon-5000', 'coupon-shipping']);
    });

    test('쿠폰은 최대 2개까지만 가질 수 있다', () => {
      try {
        order.changeCoupons([
          'coupon-5000',
          'coupon-shipping',
          'coupon-miracle',
        ]);
      } catch (error) {
        expect(error).toBeInstanceOf(ModelError);
        expect((error as ModelError).code).toBe('EXCEEDS_MAX_COUPON_COUNT');
      }
    });

    test('중복된 쿠폰 id는 적용할 수 없다', () => {
      try {
        order.changeCoupons(['coupon-5000', 'coupon-5000']);
      } catch (error) {
        expect(error).toBeInstanceOf(ModelError);
        expect((error as ModelError).code).toBe('DUPLICATE_COUPON_ID');
      }
    });
  });

  describe('배송 지역 변경', () => {
    test('도서산간 지역 여부를 변경할 수 있다', () => {
      const order = new Order({
        orderId: 'order-1',
        products: [{ productId: 'product-1', quantity: 3 }],
        couponIds: [],
      });

      expect(order.isIsland).toEqual(false);

      order.changeDeliveryArea(true);
      expect(order.isIsland).toEqual(true);
    });
  });
});
