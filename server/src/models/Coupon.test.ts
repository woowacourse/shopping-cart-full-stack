import {Coupon} from './Coupon.js';

describe('Coupon', () => {
  test('isExpired는 만료일이 지났으면 true를 반환한다', () => {
    const coupon = new Coupon('1', '쿠폰', 'FIXED5000', '2026-01-01');

    expect(coupon.isExpired(new Date('2026-02-01'))).toBe(true);
  });

  test('isExpired는 만료일이 지나지 않았으면 false를 반환한다', () => {
    const coupon = new Coupon('1', '쿠폰', 'FIXED5000', '2026-12-31');

    expect(coupon.isExpired(new Date('2026-06-01'))).toBe(false);
  });

  test('toJSON은 응답에 필요한 값을 반환한다', () => {
    const coupon = new Coupon('1', '5,000원 할인 쿠폰', 'FIXED5000', '2026-11-30');

    expect(coupon.toJSON()).toEqual({
      id: '1',
      name: '5,000원 할인 쿠폰',
      type: 'FIXED5000',
      expirationDate: '2026-11-30',
    });
  });
});
