import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { useCoupon } from '../hooks/useCoupon';
import type { Coupon } from '../api/apiTypes';

const BASE_URL = 'http://localhost:3000';

// orderCheck가 세팅되지 않은 상태(useCoupon 단독 테스트)에서 GET /order-check/coupons 기본 응답:
// - orderPrice: 0 (products 없음)
// - coupons: [FIXED5000(disabled), BOGO(enabled), FREESHIPPING(disabled), MIRACLESALE(enabled)]
// - selectedCoupons: [] (best combination이 없음)

const makeCoupon = (couponId: string, disabled = false): Coupon => ({
    couponId,
    couponTitle: `${couponId} 쿠폰`,
    disabled,
    description: [],
});

describe('useCoupon', () => {
    it('마운트 시 apiStatus가 loading이다', () => {
        const { result } = renderHook(() => useCoupon(jest.fn()));

        expect(result.current.apiStatus).toBe('loading');
    });

    it('초기화 완료 후 coupons가 채워지고 selectedIds가 서버 응답 그대로 초기화된다', async () => {
        const { result } = renderHook(() => useCoupon(jest.fn()));

        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        expect(result.current.coupons).toHaveLength(4);
        expect(result.current.selectedIds).toEqual([]);
        expect(result.current.discountAmount).toBe(0);
    });

    it('초기화 시 selectedCoupons가 있으면 할인 금액이 자동 계산된다', async () => {
        server.use(
            http.get(`${BASE_URL}/order-check/coupons`, () =>
                HttpResponse.json({
                    status: 200,
                    data: {
                        coupons: [makeCoupon('MIRACLESALE')],
                        selectedCoupons: ['MIRACLESALE'],
                    },
                })
            ),
            http.post(`${BASE_URL}/order-check/coupons`, () =>
                HttpResponse.json({ status: 200, data: { discountAmount: 13770 } })
            )
        );

        const { result } = renderHook(() => useCoupon(jest.fn()));

        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        expect(result.current.selectedIds).toEqual(['MIRACLESALE']);
        expect(result.current.discountAmount).toBe(13770);
    });

    it('API 실패 시 apiStatus가 error가 된다', async () => {
        server.use(
            http.get(`${BASE_URL}/order-check/coupons`, () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        const { result } = renderHook(() => useCoupon(jest.fn()));

        await waitFor(() => expect(result.current.apiStatus).toBe('error'));
    });

    it('toggle 호출 시 미선택 쿠폰이 selectedIds에 추가된다', async () => {
        const { result } = renderHook(() => useCoupon(jest.fn()));
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        const bogo = result.current.coupons.find((c) => c.couponId === 'BOGO')!;
        await act(async () => {
            await result.current.toggle(bogo);
        });

        expect(result.current.selectedIds).toContain('BOGO');
    });

    it('toggle 호출 시 선택된 쿠폰이 selectedIds에서 제거된다', async () => {
        server.use(
            http.get(`${BASE_URL}/order-check/coupons`, () =>
                HttpResponse.json({
                    status: 200,
                    data: {
                        coupons: [makeCoupon('BOGO')],
                        selectedCoupons: ['BOGO'],
                    },
                })
            )
        );

        const { result } = renderHook(() => useCoupon(jest.fn()));
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        const bogo = result.current.coupons.find((c) => c.couponId === 'BOGO')!;
        await act(async () => {
            await result.current.toggle(bogo);
        });

        expect(result.current.selectedIds).not.toContain('BOGO');
    });

    it('toggle 후 discountAmount가 재계산된다', async () => {
        server.use(
            http.post(`${BASE_URL}/order-check/coupons`, () =>
                HttpResponse.json({ status: 200, data: { discountAmount: 5000 } })
            )
        );

        const { result } = renderHook(() => useCoupon(jest.fn()));
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        const bogo = result.current.coupons.find((c) => c.couponId === 'BOGO')!;
        await act(async () => {
            await result.current.toggle(bogo);
        });

        expect(result.current.discountAmount).toBe(5000);
    });

    it('이미 2개 선택된 상태에서 다른 쿠폰 toggle 시 무시된다', async () => {
        server.use(
            http.get(`${BASE_URL}/order-check/coupons`, () =>
                HttpResponse.json({
                    status: 200,
                    data: {
                        coupons: [makeCoupon('A'), makeCoupon('B'), makeCoupon('C')],
                        selectedCoupons: ['A', 'B'],
                    },
                })
            )
        );

        const { result } = renderHook(() => useCoupon(jest.fn()));
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        const couponC = result.current.coupons.find((c) => c.couponId === 'C')!;
        await act(async () => {
            await result.current.toggle(couponC);
        });

        expect(result.current.selectedIds).toEqual(['A', 'B']);
    });

    it('disabled 쿠폰은 toggle이 무시된다', async () => {
        const { result } = renderHook(() => useCoupon(jest.fn()));
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        const fixed5000 = result.current.coupons.find((c) => c.couponId === 'FIXED5000')!;
        await act(async () => {
            await result.current.toggle(fixed5000);
        });

        expect(result.current.selectedIds).not.toContain('FIXED5000');
    });

    it('toggle API 실패 시 selectedIds가 이전 상태로 롤백된다', async () => {
        server.use(
            http.post(`${BASE_URL}/order-check/coupons`, () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        const { result } = renderHook(() => useCoupon(jest.fn()));
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        const bogo = result.current.coupons.find((c) => c.couponId === 'BOGO')!;
        await act(async () => {
            await result.current.toggle(bogo);
        });

        expect(result.current.selectedIds).toEqual([]);
    });

    it('toggle API 실패 시 discountAmount가 변경되지 않는다', async () => {
        server.use(
            http.post(`${BASE_URL}/order-check/coupons`, () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        const { result } = renderHook(() => useCoupon(jest.fn()));
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        const bogo = result.current.coupons.find((c) => c.couponId === 'BOGO')!;
        await act(async () => {
            await result.current.toggle(bogo);
        });

        expect(result.current.discountAmount).toBe(0);
    });

    it('handleConfirm 호출 시 selectCoupons API가 호출되고 close가 실행된다', async () => {
        const close = jest.fn();
        const { result } = renderHook(() => useCoupon(close));
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        await act(async () => {
            await result.current.handleConfirm();
        });

        expect(close).toHaveBeenCalledTimes(1);
    });

    it('handleConfirm API 실패 시에도 close가 실행된다', async () => {
        server.use(
            http.patch(`${BASE_URL}/order-check/coupons`, () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        const close = jest.fn();
        const { result } = renderHook(() => useCoupon(close));
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        await act(async () => {
            await result.current.handleConfirm();
        });

        expect(close).toHaveBeenCalledTimes(1);
    });
});
