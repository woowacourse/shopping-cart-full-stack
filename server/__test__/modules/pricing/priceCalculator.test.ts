import { OrderContext } from '../../../src/interfaces/couponPolicy.interface.js';
import { priceCalculator } from '../../../src/utils/priceCalculator.js';
import {
  createFixedAmountCoupon,
  createBogoCoupon,
  createFreeShippingCoupon,
  createMiracleSaleCoupon,
  createCouponContext,
} from '../../helpers/createCoupons.js';

describe('priceCalculator', () => {
  describe('주문 금액 계산', () => {
    test('주문 금액은 상품 가격과 수량의 합으로 계산한다', () => {
      const context: OrderContext = {
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 20000,
            quantity: 3,
          },
          {
            productId: 'product-2',
            productName: '상품B',
            productPrice: 14000,
            quantity: 2,
          },
        ],
        isIsland: false,
        now: new Date('2026-06-14T10:00:00'),
      };

      const orderPrice = priceCalculator.calculateOrderPrice(context);

      expect(orderPrice).toBe(88000);
    });
  });

  describe('배송비 계산', () => {
    test('주문 금액이 100,000원 이상이면 기본 배송비는 0원이다', () => {
      const context: OrderContext = {
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 50000,
            quantity: 2,
          },
        ],
        isIsland: false,
        now: new Date('2026-06-14T10:00:00'),
      };

      const deliveryFee = priceCalculator.calculateDeliveryFee(context);

      expect(deliveryFee).toBe(0);
    });
    test('주문 금액이 100,000원 미만이면 기본 배송비는 3,000원이다', () => {
      const context: OrderContext = {
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 40000,
            quantity: 2,
          },
        ],
        isIsland: false,
        now: new Date('2026-06-14T10:00:00'),
      };

      const deliveryFee = priceCalculator.calculateDeliveryFee(context);

      expect(deliveryFee).toBe(3000);
    });
    test('도서산간 지역이면 배송비 3,000원이 추가된다', () => {
      const context: OrderContext = {
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 50000,
            quantity: 2,
          },
        ],
        isIsland: true,
        now: new Date('2026-06-14T10:00:00'),
      };

      const deliveryFee = priceCalculator.calculateDeliveryFee(context);

      expect(deliveryFee).toBe(3000);
    });
  });

  describe('복합 쿠폰 계산', () => {
    test('정액 할인 쿠폰을 먼저 적용한 뒤, 정율 할인 쿠폰을 적용한다', () => {
      const context = createCouponContext({
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 52500,
            quantity: 2,
          },
        ],
        isIsland: false,
        now: new Date('2026-06-14T06:00:00'),
      });
      const fixedAmountCoupon = createFixedAmountCoupon();
      const miracleSaleCoupon = createMiracleSaleCoupon();
      const coupons = [fixedAmountCoupon, miracleSaleCoupon];

      const discount = priceCalculator.calculateCouponDiscount(
        context,
        coupons,
      );

      // 105000에서 정액 쿠폰으로 5000원 제외, 100000원 중 정율 쿠폰으로 30000원 제외 -> 총 할인 금액: 35000원
      expect(discount).toEqual({
        couponIds: [fixedAmountCoupon.couponId, miracleSaleCoupon.couponId],
        productDiscountPrice: 35000,
        deliveryDiscountPrice: 0,
      });
    });
    test('가능한 쿠폰 조합 중 할인 효과가 가장 큰 조합을 선택한다', () => {
      const context = createCouponContext({
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 150000,
            quantity: 2,
          },
          {
            productId: 'product-2',
            productName: '상품B',
            productPrice: 100000,
            quantity: 3,
          },
        ],
        isIsland: true,
        now: new Date('2026-06-14T06:00:00'),
      });
      const fixedAmountCoupon = createFixedAmountCoupon();
      const bogoCoupon = createBogoCoupon();
      const freeShippingCoupon = createFreeShippingCoupon();
      const miracleSaleCoupon = createMiracleSaleCoupon();
      const coupons = [
        fixedAmountCoupon,
        bogoCoupon,
        freeShippingCoupon,
        miracleSaleCoupon,
      ];

      const discount = priceCalculator.calculateBestCouponDiscount(
        context,
        coupons,
      );

      // 모든 쿠폰이 사용 가능하다고 했을 때, 정액 쿠폰 중 가장 할인 금액이 큰 Bogo 쿠폰, 그 뒤로 정율 쿠폰인 Miracle 쿠폰 순으로 적용한다.
      // 총 금액 600000원, Bogo 쿠폰 적용 시 100000원 할인, 이후 남은 금액 500000원에 30% 할인을 적용하면 150000원 할인 -> 총 250000원 할인
      expect(discount).toEqual({
        couponIds: [bogoCoupon.couponId, miracleSaleCoupon.couponId],
        productDiscountPrice: 250000,
        deliveryDiscountPrice: 0,
      });
    });
    test('선택한 쿠폰의 id와 총 할인 금액을 함께 반환한다', () => {
      const context = createCouponContext({
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 60000,
            quantity: 1,
          },
        ],
        isIsland: true,
        now: new Date('2026-06-14T10:00:00'),
      });
      const freeShippingCoupon = createFreeShippingCoupon();

      const discount = priceCalculator.calculateSelectedCouponDiscount(
        context,
        [freeShippingCoupon],
      );

      expect(discount).toEqual({
        couponIds: [freeShippingCoupon.couponId],
        productDiscountPrice: 0,
        deliveryDiscountPrice: 6000,
      });
    });
  });
});
