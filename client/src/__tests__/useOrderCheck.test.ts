import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { useOrderCheck } from '../hooks/useOrderCheck';

const BASE_URL = 'http://localhost:3000';

// 초기 mock 카트: Shopping Basket(id:'1', price:18000, qty:2) + Reusable Cup(id:'3', price:9900, qty:1)
// → orderPrice: 45900, deliveryFee: 3000, totalOrderAmount: 48900
// 도서산간 지역 추가배송비: 3000 → 토글 후 deliveryFee: 6000, totalOrderAmount: 51900

describe('useOrderCheck', () => {
    it('마운트 시 apiStatus가 loading이다', () => {
        const { result } = renderHook(() => useOrderCheck());

        expect(result.current.apiStatus).toBe('loading');
    });

    it('초기화 완료 후 apiStatus가 success이고 products와 payInfo가 채워진다', async () => {
        const { result } = renderHook(() => useOrderCheck());

        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        expect(result.current.products).toHaveLength(2);
        expect(result.current.products[0].name).toBe('Shopping Basket');
        expect(result.current.payInfo.orderPrice).toBe(45900);
        expect(result.current.payInfo.deliveryFee).toBe(3000);
        expect(result.current.payInfo.totalOrderAmount).toBe(48900);
    });

    it('POST /order-check 실패 시 apiStatus가 error가 된다', async () => {
        server.use(
            http.post(`${BASE_URL}/order-check`, () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        const { result } = renderHook(() => useOrderCheck());

        await waitFor(() => expect(result.current.apiStatus).toBe('error'));
    });

    it('GET /order-check 실패 시 apiStatus가 error가 된다', async () => {
        server.use(
            http.get(`${BASE_URL}/order-check`, () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        const { result } = renderHook(() => useOrderCheck());

        await waitFor(() => expect(result.current.apiStatus).toBe('error'));
    });

    it('productCount와 totalQuantity가 올바르게 계산된다', async () => {
        const { result } = renderHook(() => useOrderCheck());

        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        expect(result.current.productCount).toBe(2);
        expect(result.current.totalQuantity).toBe(3); // 2 + 1
    });

    it('handleRemoteAreaToggle 호출 시 remoteAreaChecked가 즉시 true로 토글된다', async () => {
        const { result } = renderHook(() => useOrderCheck());
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        act(() => {
            result.current.handleRemoteAreaToggle();
        });

        expect(result.current.remoteAreaChecked).toBe(true);
    });

    it('handleRemoteAreaToggle API 실패 시 remoteAreaChecked가 false로 원복된다', async () => {
        const { result } = renderHook(() => useOrderCheck());
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        server.use(
            http.patch(`${BASE_URL}/order-check/select/remote-areas`, () =>
                HttpResponse.json({ status: 500 }, { status: 500 })
            )
        );

        await act(async () => {
            result.current.handleRemoteAreaToggle();
        });

        expect(result.current.remoteAreaChecked).toBe(false);
    });

    it('handleRemoteAreaToggle 성공 후 payInfo의 배송비가 도서산간 추가 금액만큼 갱신된다', async () => {
        const { result } = renderHook(() => useOrderCheck());
        await waitFor(() => expect(result.current.apiStatus).toBe('success'));

        await act(async () => {
            result.current.handleRemoteAreaToggle();
        });

        await waitFor(() => expect(result.current.payInfo.deliveryFee).toBe(6000));
        expect(result.current.payInfo.totalOrderAmount).toBe(51900);
    });
});
