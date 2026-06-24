import {act, renderHook} from '@testing-library/react';

import {useCouponDraftSelection} from './useCouponDraftSelection.js';

function renderUseCouponDraftSelection({
  canUseRecommendedCoupons = true,
  recommendedCouponIds = [1, 3],
}: {
  canUseRecommendedCoupons?: boolean;
  recommendedCouponIds?: number[];
} = {}) {
  return renderHook(
    ({canUseRecommendedCoupons, recommendedCouponIds}) =>
      useCouponDraftSelection({canUseRecommendedCoupons, recommendedCouponIds}),
    {
      initialProps: {
        canUseRecommendedCoupons,
        recommendedCouponIds,
      },
    }
  );
}

describe('useCouponDraftSelection', () => {
  test('모달을 처음 열면 추천 쿠폰을 draft 선택값으로 채운다', () => {
    const {result} = renderUseCouponDraftSelection({recommendedCouponIds: [1, 3]});

    act(() => {
      result.current.openCouponModal();
    });

    expect(result.current.draftCouponIds).toEqual([1, 3]);
  });

  test('쿠폰 조회가 끝난 뒤 추천 쿠폰을 draft 선택값으로 채운다', () => {
    const {result, rerender} = renderUseCouponDraftSelection({canUseRecommendedCoupons: false});

    act(() => {
      result.current.openCouponModal();
    });

    expect(result.current.draftCouponIds).toEqual([]);

    rerender({
      canUseRecommendedCoupons: true,
      recommendedCouponIds: [1, 3],
    });

    expect(result.current.draftCouponIds).toEqual([1, 3]);
  });

  test('모달을 닫았다가 다시 열어도 적용 전 draft 선택을 유지한다', () => {
    const {result} = renderUseCouponDraftSelection();

    act(() => {
      result.current.openCouponModal();
    });

    act(() => {
      result.current.setDraftCouponIds([1, 3]);
    });

    act(() => {
      result.current.closeCouponModal();
    });

    act(() => {
      result.current.openCouponModal();
    });

    expect(result.current.draftCouponIds).toEqual([1, 3]);
  });

  test('사용자가 쿠폰을 전부 해제하면 적용된 쿠폰으로 다시 복원하지 않는다', () => {
    const {result} = renderUseCouponDraftSelection();

    act(() => {
      result.current.openCouponModal();
    });

    act(() => {
      result.current.setDraftCouponIds([1]);
    });

    act(() => {
      result.current.applyDraftCouponIds();
    });

    act(() => {
      result.current.setDraftCouponIds([]);
    });

    act(() => {
      result.current.openCouponModal();
    });

    expect(result.current.draftCouponIds).toEqual([]);
  });
});
