// 쿠폰들의 조합 전체를 계산하는 메서드

import {
  CouponContext,
  CouponPolicy,
} from '../interfaces/couponPolicy.interface.js';

export const createCouponCombinations = (
  context: CouponContext,
  coupons: CouponPolicy[],
) => {
  // 현재 쿠폰 정책에 의해 사용 가능한 쿠폰을 추출
  const availableCoupons = filterApplicableCoupons(context, coupons);

  // 사용 가능한 쿠폰 목록의 모든 조합을 반환
  const emptyCombination = [[]];

  const oneCouponCombinations = availableCoupons.map((coupon) => [coupon]);

  const twoCouponCombinations = availableCoupons.flatMap((coupon, index) =>
    availableCoupons.slice(index + 1).map((nextCoupon) => [coupon, nextCoupon]),
  );

  return [
    ...emptyCombination,
    ...oneCouponCombinations,
    ...twoCouponCombinations,
  ];
};

export const filterApplicableCoupons = (
  context: CouponContext,
  coupons: CouponPolicy[],
) => {
  return coupons.filter((coupon) => coupon.isApplicable(context));
};
