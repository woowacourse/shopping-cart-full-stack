import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { App } from './App';

const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('라우팅 및 주문 확인 페이지 통합 테스트', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('주문 확인 버튼을 누르면 preorder 페이지로 넘어간다.', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/cart');

    render(<App />);

    await screen.findByText('전체 선택');

    const orderButton = screen.getByRole('button', { name: '주문 확인' });
    await user.click(orderButton);

    await waitFor(() => {
      expect(
        screen.getByText('결제 정보를 불러오는 중입니다...'),
      ).toBeInTheDocument();
    });

    expect(await screen.findByText('MSW 테스트 상품')).toBeInTheDocument();
  });

  it('비정상적인 방법으로 최종 영수증(/orders/:orderId) 접근 시 에러 알림 후 장바구니로 리다이렉트', async () => {
    window.history.pushState({}, '', '/orders/invalid-id');
    render(<App />);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('잘못된 접근입니다.');
    });

    expect(await screen.findByText('장바구니')).toBeInTheDocument();
  });
});
