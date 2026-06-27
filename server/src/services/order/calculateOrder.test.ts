import {Coupon} from '../../models/Coupon.js';
import {calculateOrder} from './calculateOrder.js';
import type {OrderLineItem} from './couponPolicy.js';

const FAR_FUTURE = '2099-12-31';

const fixed5000 = new Coupon('1', '5,000원 할인 쿠폰', 'FIXED5000', FAR_FUTURE);
const bogo = new Coupon('2', '2+1 쿠폰', 'BOGO', FAR_FUTURE);
const freeShipping = new Coupon('3', '무료 배송 쿠폰', 'FREESHIPPING', FAR_FUTURE);
const miracleSale = new Coupon('4', '30% 시간제 할인 쿠폰', 'MIRACLESALE', FAR_FUTURE);

// MIRACLESALE 적용 시간대: 오전 4~7시
const morning = new Date(2026, 5, 14, 5); // 05:00 (적용 가능)
const noon = new Date(2026, 5, 14, 12); // 12:00 (적용 불가)

const item = (price: number, quantity: number, productId = '1'): OrderLineItem => ({
  productId,
  price,
  quantity,
});

describe('calculateOrder', () => {
  describe('주문금액 / 배송비', () => {
    test('주문금액은 price × quantity 의 합이다', () => {
      const result = calculateOrder({
        items: [item(1000, 2), item(2000, 1, '2')],
        candidateCoupons: [],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.orderAmount).toBe(4000);
    });

    test('주문금액 10만 미만이면 배송비 3,000원', () => {
      const result = calculateOrder({
        items: [item(2000, 1)],
        candidateCoupons: [],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.deliveryFee).toBe(3000);
      expect(result.totalPrice).toBe(5000);
    });

    test('주문금액 10만 이상이면 무료 배송', () => {
      const result = calculateOrder({
        items: [item(100000, 1)],
        candidateCoupons: [],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.deliveryFee).toBe(0);
    });

    test('주문금액 10만 미만 + 도서산간이면 배송비 6,000원 (3,000 + 3,000)', () => {
      const result = calculateOrder({
        items: [item(2000, 1)],
        candidateCoupons: [],
        isRemoteArea: true,
        now: noon,
      });

      expect(result.deliveryFee).toBe(6000);
    });

    test('주문금액 10만 이상이면 도서산간이어도 배송비 무료', () => {
      const result = calculateOrder({
        items: [item(100000, 1)],
        candidateCoupons: [],
        isRemoteArea: true,
        now: noon,
      });

      expect(result.deliveryFee).toBe(0);
    });
  });

  describe('FIXED5000', () => {
    test('주문금액 10만 이상이면 5,000원 할인', () => {
      const result = calculateOrder({
        items: [item(100000, 1)],
        candidateCoupons: [fixed5000],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.couponDiscount).toBe(5000);
      expect(result.appliedCoupons).toEqual(['1']);
    });

    test('주문금액 10만 미만이면 적용되지 않는다', () => {
      const result = calculateOrder({
        items: [item(50000, 1)],
        candidateCoupons: [fixed5000],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.couponDiscount).toBe(0);
      expect(result.appliedCoupons).toEqual([]);
    });
  });

  describe('BOGO', () => {
    test('동일 상품 2개 이상이면 단가 가장 높은 상품 1개를 무료 처리한다', () => {
      const result = calculateOrder({
        items: [item(30000, 2, '1'), item(10000, 1, '2')],
        candidateCoupons: [bogo],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.couponDiscount).toBe(30000);
      expect(result.appliedCoupons).toEqual(['2']);
    });

    test('수량 2개 이상 상품이 없으면 적용되지 않는다', () => {
      const result = calculateOrder({
        items: [item(30000, 1)],
        candidateCoupons: [bogo],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.couponDiscount).toBe(0);
      expect(result.appliedCoupons).toEqual([]);
    });
  });

  describe('MIRACLESALE', () => {
    test('오전 4~7시이면 30% 할인', () => {
      const result = calculateOrder({
        items: [item(10000, 1)],
        candidateCoupons: [miracleSale],
        isRemoteArea: false,
        now: morning,
      });

      expect(result.couponDiscount).toBe(3000);
      expect(result.appliedCoupons).toEqual(['4']);
    });

    test('적용 시간대가 아니면 적용되지 않는다', () => {
      const result = calculateOrder({
        items: [item(10000, 1)],
        candidateCoupons: [miracleSale],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.couponDiscount).toBe(0);
      expect(result.appliedCoupons).toEqual([]);
    });
  });

  describe('FREESHIPPING', () => {
    test('주문금액 5만 이상이면 도서산간 추가분까지 배송비 무료', () => {
      const result = calculateOrder({
        items: [item(60000, 1)],
        candidateCoupons: [freeShipping],
        isRemoteArea: true,
        now: noon,
      });

      expect(result.deliveryFee).toBe(0);
      expect(result.couponDiscount).toBe(0);
      expect(result.appliedCoupons).toEqual(['3']);
    });

    test('주문금액 5만 미만이면 적용되지 않는다', () => {
      const result = calculateOrder({
        items: [item(40000, 1)],
        candidateCoupons: [freeShipping],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.deliveryFee).toBe(3000);
      expect(result.appliedCoupons).toEqual([]);
    });
  });

  describe('복합 적용 — 적용 순서', () => {
    test('정액(5,000원)을 먼저 차감한 뒤 정율(30%)을 적용한다', () => {
      const result = calculateOrder({
        items: [item(100000, 1)],
        candidateCoupons: [fixed5000, miracleSale],
        isRemoteArea: false,
        now: morning,
      });

      // (100000 - 5000) * 0.3 = 28500, couponDiscount = 5000 + 28500 = 33500
      // (30% 먼저였다면 35000 이 되어야 함 → 순서 검증)
      expect(result.couponDiscount).toBe(33500);
      expect(result.totalPrice).toBe(66500);
      expect(result.appliedCoupons).toEqual(['1', '4']);
    });
  });

  describe('최적 조합 자동 선택 (최대 2개)', () => {
    test('후보 4개 중 절감액이 가장 큰 2개 조합을 선택한다', () => {
      const result = calculateOrder({
        items: [item(100000, 2)], // orderAmount 200000, qty 2 → BOGO 무료단가 100000
        candidateCoupons: [fixed5000, bogo, freeShipping, miracleSale],
        isRemoteArea: false,
        now: morning,
      });

      // 최적: BOGO(-100000) + MIRACLESALE(나머지 100000의 30% = 30000) = 130000
      expect(result.appliedCoupons).toEqual(['2', '4']);
      expect(result.couponDiscount).toBe(130000);
      expect(result.appliedCoupons.length).toBeLessThanOrEqual(2);
    });
  });

  describe('만료 쿠폰', () => {
    test('만료된 쿠폰은 적용 후보에서 제외된다', () => {
      const expired = new Coupon('1', '만료 쿠폰', 'FIXED5000', '2020-01-01');

      const result = calculateOrder({
        items: [item(100000, 1)],
        candidateCoupons: [expired],
        isRemoteArea: false,
        now: noon,
      });

      expect(result.couponDiscount).toBe(0);
      expect(result.appliedCoupons).toEqual([]);
    });
  });
});
