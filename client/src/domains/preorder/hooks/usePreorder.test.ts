import {renderHook, waitFor} from '@testing-library/react';
import {http, HttpResponse} from 'msw';

import {usePreorder} from './usePreorder.js';
import {mockServer} from '../../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

function mockGetPreorder() {
  mockServer.use(
    http.get(`${API_BASE_URL}/preorder/preorder-1`, () => {
      return HttpResponse.json({
        body: {
          preorderId: 'preorder-1',
          items: [
            {
              productId: 'product-1',
              price: 35000,
              name: '상품이름A',
              imageUrl: '/product-a.png',
              quantity: 2,
            },
          ],
        },
      });
    })
  );
}

describe('usePreorder', () => {
  test('preorderId 기준으로 주문 확인 정보를 조회한다', async () => {
    mockGetPreorder();

    const {result} = renderHook(() => usePreorder('preorder-1'));

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.preorder?.preorderId).toBe('preorder-1');
    expect(result.current.error).toBeNull();
  });

  test('preorderId가 없으면 notFound 에러 타입으로 변경한다', async () => {
    const {result} = renderHook(() => usePreorder(undefined));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.preorder).toBeNull();
    expect(result.current.error).toEqual({
      message: '주문 확인 정보를 찾을 수 없습니다.',
      type: 'notFound',
    });
  });

  test('주문 확인 정보가 만료되면 expired 에러 타입으로 변경한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/preorder/preorder-1`, () => {
        return HttpResponse.json({body: {message: '주문 확인 시간이 만료되었습니다.'}}, {status: 410});
      })
    );

    const {result} = renderHook(() => usePreorder('preorder-1'));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.preorder).toBeNull();
    expect(result.current.error).toEqual({
      message: '주문 확인 시간이 만료되었습니다.',
      type: 'expired',
    });
  });
});
