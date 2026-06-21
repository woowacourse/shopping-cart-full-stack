import type {Coupon} from '../../coupon/domain/types.js';
import {getCouponItemDisabled, getNextSelectedCouponIds} from './couponSelection.js';

function createCoupon(couponId: number, disabled = false): Coupon {
  return {
    couponId,
    code: `COUPON_${couponId}`,
    name: `쿠폰 ${couponId}`,
    expirationDate: '2026-12-31T14:59:59.000Z',
    condition: {
      description: null,
    },
    disabled,
    disabledReason: disabled ? '사용할 수 없습니다.' : null,
  };
}

describe('couponSelection', () => {
  test('선택되지 않은 사용 가능 쿠폰을 추가한다', () => {
    const coupon = createCoupon(1);

    expect(getNextSelectedCouponIds({coupon, selectedCouponIds: []})).toEqual([1]);
  });

  test('이미 선택된 쿠폰은 비활성 여부와 관계없이 해제한다', () => {
    const coupon = createCoupon(1, true);

    expect(getNextSelectedCouponIds({coupon, selectedCouponIds: [1]})).toEqual([]);
  });

  test('비활성 쿠폰은 새로 선택하지 않는다', () => {
    const coupon = createCoupon(1, true);

    expect(getNextSelectedCouponIds({coupon, selectedCouponIds: []})).toEqual([]);
  });

  test('이미 2개 선택된 경우 새 쿠폰을 추가하지 않는다', () => {
    const coupon = createCoupon(3);

    expect(getNextSelectedCouponIds({coupon, selectedCouponIds: [1, 2]})).toEqual([1, 2]);
  });

  test('선택된 쿠폰은 선택 한도와 관계없이 비활성 UI로 처리하지 않는다', () => {
    const coupon = createCoupon(1, true);

    expect(getCouponItemDisabled({coupon, selectedCouponIds: [1, 2]})).toBe(false);
  });

  test('선택 한도가 찬 상태의 미선택 쿠폰은 비활성 UI로 처리한다', () => {
    const coupon = createCoupon(3);

    expect(getCouponItemDisabled({coupon, selectedCouponIds: [1, 2]})).toBe(true);
  });
});
