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

  test('draft가 비어 있으면 적용된 쿠폰을 기준으로 모달을 연다', () => {
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

    expect(result.current.draftCouponIds).toEqual([1]);
  });
});
