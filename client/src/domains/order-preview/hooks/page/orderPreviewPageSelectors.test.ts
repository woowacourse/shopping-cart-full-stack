import {
  getOrderPreviewPageErrorMessage,
  getOrderPreviewPageStatus,
  getPreorderSummary,
  getShouldReturnToCart,
} from './orderPreviewPageSelectors.js';
import type {PreorderItem} from '../../../preorder/domain/types.js';

const preorderItems: PreorderItem[] = [
  {
    productId: 'product-1',
    name: '상품A',
    price: 10000,
    imageUrl: '/product-a.png',
    quantity: 2,
  },
  {
    productId: 'product-2',
    name: '상품B',
    price: 20000,
    imageUrl: '/product-b.png',
    quantity: 3,
  },
];

describe('orderPreviewPageSelectors', () => {
  test('preorder 상품 종류 수와 총 수량을 계산한다', () => {
    expect(getPreorderSummary(preorderItems)).toEqual({
      itemCount: 2,
      quantity: 5,
    });
  });

  test('preorder 상품이 없으면 0으로 계산한다', () => {
    expect(getPreorderSummary(undefined)).toEqual({
      itemCount: 0,
      quantity: 0,
    });
  });

  test('preorder나 preview 중 하나라도 에러이면 페이지 상태는 error이다', () => {
    expect(getOrderPreviewPageStatus('error', 'success')).toBe('error');
    expect(getOrderPreviewPageStatus('success', 'error')).toBe('error');
  });

  test('preorder나 preview 중 하나라도 로딩이면 페이지 상태는 loading이다', () => {
    expect(getOrderPreviewPageStatus('loading', 'success')).toBe('loading');
    expect(getOrderPreviewPageStatus('success', 'loading')).toBe('loading');
  });

  test('preorder와 preview가 모두 성공이면 페이지 상태는 success이다', () => {
    expect(getOrderPreviewPageStatus('success', 'success')).toBe('success');
  });

  test('preorder 에러가 있으면 preorder 에러 메시지를 우선한다', () => {
    expect(
      getOrderPreviewPageErrorMessage({
        orderPreviewErrorMessage: '결제 금액 계산 실패',
        preorderErrorMessage: '주문 확인 정보 없음',
        preorderStatus: 'error',
      })
    ).toBe('주문 확인 정보 없음');
  });

  test('preorder 에러가 아니면 preview 에러 메시지를 사용한다', () => {
    expect(
      getOrderPreviewPageErrorMessage({
        orderPreviewErrorMessage: '결제 금액 계산 실패',
        preorderErrorMessage: '',
        preorderStatus: 'success',
      })
    ).toBe('결제 금액 계산 실패');
  });

  test('만료되었거나 찾을 수 없는 preorder 에러이면 장바구니로 돌아간다', () => {
    expect(getShouldReturnToCart('expired')).toBe(true);
    expect(getShouldReturnToCart('notFound')).toBe(true);
    expect(getShouldReturnToCart('default')).toBe(false);
  });
});
