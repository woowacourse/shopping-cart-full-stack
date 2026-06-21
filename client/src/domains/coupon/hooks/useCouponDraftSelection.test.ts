import {act, renderHook} from '@testing-library/react';

import {useCouponDraftSelection} from './useCouponDraftSelection.js';

describe('useCouponDraftSelection', () => {
  test('모달을 닫았다가 다시 열어도 적용 전 draft 선택을 유지한다', () => {
    const {result} = renderHook(() => useCouponDraftSelection());

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
    const {result} = renderHook(() => useCouponDraftSelection());

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
