import {renderHook} from '@testing-library/react';

import {useCouponAutoSelection} from './useCouponAutoSelection.js';

describe('useCouponAutoSelection', () => {
  test('쿠폰 모달이 열리고 쿠폰 조회가 성공하면 추천 쿠폰을 자동 선택한다', () => {
    const onSelectCoupons = jest.fn();

    renderHook(() =>
      useCouponAutoSelection({
        couponsStatus: 'success',
        isCouponModalOpen: true,
        recommendedCouponIds: [1, 3],
        selectedCouponIds: [],
        onSelectCoupons,
      })
    );

    expect(onSelectCoupons).toHaveBeenCalledWith([1, 3]);
  });

  test('이미 선택한 쿠폰이 있으면 추천 쿠폰으로 덮어쓰지 않는다', () => {
    const onSelectCoupons = jest.fn();

    renderHook(() =>
      useCouponAutoSelection({
        couponsStatus: 'success',
        isCouponModalOpen: true,
        recommendedCouponIds: [1, 3],
        selectedCouponIds: [1],
        onSelectCoupons,
      })
    );

    expect(onSelectCoupons).not.toHaveBeenCalled();
  });

  test('모달이 닫혀 있거나 쿠폰 조회가 끝나지 않았으면 자동 선택하지 않는다', () => {
    const onSelectCoupons = jest.fn();

    const {rerender} = renderHook(
      ({couponsStatus, isCouponModalOpen}: {couponsStatus: 'loading' | 'success'; isCouponModalOpen: boolean}) =>
        useCouponAutoSelection({
          couponsStatus,
          isCouponModalOpen,
          recommendedCouponIds: [1, 3],
          selectedCouponIds: [],
          onSelectCoupons,
        }),
      {
        initialProps: {
          couponsStatus: 'loading',
          isCouponModalOpen: true,
        },
      }
    );

    rerender({
      couponsStatus: 'success',
      isCouponModalOpen: false,
    });

    expect(onSelectCoupons).not.toHaveBeenCalled();
  });

  test('한 번 자동 선택한 뒤 다시 렌더링되어도 중복 선택하지 않는다', () => {
    const onSelectCoupons = jest.fn();

    const {rerender} = renderHook(
      () =>
        useCouponAutoSelection({
          couponsStatus: 'success',
          isCouponModalOpen: true,
          recommendedCouponIds: [1, 3],
          selectedCouponIds: [],
          onSelectCoupons,
        })
    );

    rerender();

    expect(onSelectCoupons).toHaveBeenCalledTimes(1);
  });
});
