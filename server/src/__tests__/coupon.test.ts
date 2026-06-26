import { coupons } from '../db/inMemoryDb.js';
import {
  DiscountContext,
  calculateCouponsDiscount,
  findBestCouponCombination,
  isCouponDisabled,
} from '../domain/coupon/coupon.calculator.js';
import { Coupon } from '../model/Coupon.js';

const couponOf = (code: string): Coupon =>
  coupons.find((coupon) => coupon.code === code)!;

const FIXED5000 = couponOf('FIXED5000');
const BOGO = couponOf('BOGO');
const FREESHIPPING = couponOf('FREESHIPPING');
const MIRACLESALE = couponOf('MIRACLESALE');

const context = (overrides: Partial<DiscountContext> = {}): DiscountContext => ({
  orderItems: [{ price: 10000, orderCount: 1 }],
  orderPrice: 120000,
  shippingFee: 3000,
  now: new Date('2026-06-21T05:00:00'),
  ...overrides,
});

describe('쿠폰 적용 가능 여부 (isCouponDisabled)', () => {
  test('FIXED5000은 주문 금액이 최소 주문 금액(100,000원) 미만이면 비활성된다.', () => {
    expect(isCouponDisabled(FIXED5000, context({ orderPrice: 99999 }))).toBe(
      true,
    );
    expect(isCouponDisabled(FIXED5000, context({ orderPrice: 100000 }))).toBe(
      false,
    );
  });

  test('MIRACLESALE은 사용 가능 시간(04:00~07:00) 밖이면 비활성된다.', () => {
    const inside = context({ now: new Date('2026-06-21T05:00:00') });
    const outside = context({ now: new Date('2026-06-21T10:00:00') });

    expect(isCouponDisabled(MIRACLESALE, inside)).toBe(false);
    expect(isCouponDisabled(MIRACLESALE, outside)).toBe(true);
  });

  test('만료일이 지난 쿠폰은 비활성된다.', () => {
    const expired = context({ now: new Date('2027-01-01T05:00:00') });

    expect(isCouponDisabled(BOGO, expired)).toBe(true);
  });

  test('BOGO는 동일 상품 3개 이상인 항목이 없으면 비활성된다.', () => {
    const notEnough = context({ orderItems: [{ price: 35000, orderCount: 2 }] });
    const enough = context({ orderItems: [{ price: 35000, orderCount: 3 }] });

    expect(isCouponDisabled(BOGO, notEnough)).toBe(true);
    expect(isCouponDisabled(BOGO, enough)).toBe(false);
  });
});

describe('쿠폰 할인 금액 계산 (calculateCouponsDiscount)', () => {
  test('FIXED5000은 5,000원을 할인한다.', () => {
    expect(calculateCouponsDiscount([FIXED5000], context())).toBe(5000);
  });

  test('BOGO는 수량 3개 이상 상품 중 단가가 가장 높은 1개를 무료 처리한다.', () => {
    const discount = calculateCouponsDiscount(
      [BOGO],
      context({
        orderItems: [
          { price: 35000, orderCount: 3 },
          { price: 25000, orderCount: 5 },
        ],
      }),
    );

    expect(discount).toBe(35000);
  });

  test('BOGO는 수량 3개 미만 상품만 있으면 할인이 없다.', () => {
    const discount = calculateCouponsDiscount(
      [BOGO],
      context({ orderItems: [{ price: 35000, orderCount: 2 }] }),
    );

    expect(discount).toBe(0);
  });

  test('FREESHIPPING은 배송비만큼 할인한다.', () => {
    expect(
      calculateCouponsDiscount([FREESHIPPING], context({ shippingFee: 6000 })),
    ).toBe(6000);
  });

  test('MIRACLESALE은 주문 금액의 30%를 할인한다.', () => {
    expect(
      calculateCouponsDiscount([MIRACLESALE], context({ orderPrice: 100000 })),
    ).toBe(30000);
  });

  test('정액 쿠폰을 먼저 적용하고, 할인된 금액에 정율 쿠폰을 적용한다.', () => {
    // FIXED5000 먼저: 100,000 - 5,000 = 95,000 → 30% = 28,500 → 합계 33,500
    const discount = calculateCouponsDiscount(
      [FIXED5000, MIRACLESALE],
      context({ orderPrice: 100000 }),
    );

    expect(discount).toBe(33500);
  });
});

describe('최적 쿠폰 조합 (findBestCouponCombination)', () => {
  test('할인 효과가 가장 큰 조합(최대 2개)을 선택한다.', () => {
    const best = findBestCouponCombination(
      coupons,
      context({
        orderPrice: 120000,
        orderItems: [{ price: 60000, orderCount: 3 }],
        shippingFee: 3000,
      }),
    );

    const codes = best.map((coupon) => coupon.code).sort();
    expect(codes).toEqual(['BOGO', 'MIRACLESALE']);
    expect(best).toHaveLength(2);
  });

  test('적용 불가능한 쿠폰은 조합에서 제외한다.', () => {
    // 주문 4만원(FIXED5000, FREESHIPPING 최소금액 미달), 10시(MIRACLESALE 시간 외)이면 BOGO만 사용 가능
    const best = findBestCouponCombination(
      coupons,
      context({
        orderPrice: 40000,
        orderItems: [{ price: 10000, orderCount: 3 }],
        now: new Date('2026-06-21T10:00:00'),
      }),
    );

    expect(best.map((coupon) => coupon.code)).toEqual(['BOGO']);
  });
});
