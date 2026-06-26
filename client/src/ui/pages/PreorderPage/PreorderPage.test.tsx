import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { PreorderPage } from './PreorderPage';

const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('PreorderPage 통합 테스트', () => {
  const renderPreorderPage = () => {
    return render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/preorder',
            state: { preorderId: 'msw-test-preorder-id' },
          },
        ]}
      >
        <Routes>
          <Route path="/preorder" element={<PreorderPage />} />
          <Route path="/cart" element={<div>장바구니 화면</div>} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('MSW에서 데이터를 불러와 주문 내역을 정상적으로 화면에 그린다', async () => {
    renderPreorderPage();

    expect(
      screen.getByText('결제 정보를 불러오는 중입니다...'),
    ).toBeInTheDocument();

    expect(await screen.findByText('주문 확인')).toBeInTheDocument();
    expect(screen.getByText('MSW 테스트 상품')).toBeInTheDocument();

    expect(screen.getByText('58,000원')).toBeInTheDocument();
  });

  it('쿠폰 모달을 열어 쿠폰을 해제하면 총 결제 금액이 원상 복구된다', async () => {
    const user = userEvent.setup();
    renderPreorderPage();

    await screen.findByText('주문 확인');

    const openModalBtn = screen.getByRole('button', { name: '쿠폰 적용' });
    await user.click(openModalBtn);

    const couponName = await screen.findByText('MSW 5,000원 할인');
    expect(couponName).toBeInTheDocument();

    await user.click(couponName);

    const applyBtn = screen.getByRole('button', { name: /할인 쿠폰 사용하기/ });
    await user.click(applyBtn);

    await waitFor(() => {
      expect(
        screen.queryByText('쿠폰을 선택해 주세요'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('63,000원')).toBeInTheDocument();
    });
  });

  it('409 에러 발생 시 알림창을 띄우고 장바구니로 리다이렉트 된다', async () => {
    const user = userEvent.setup();
    renderPreorderPage();

    await screen.findByText('주문 확인');

    const payButton = screen.getByRole('button', { name: '결제하기' });
    await user.click(payButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining('결제 요청 금액이 일치하지 않습니다'),
      );
    });

    expect(screen.getByText('장바구니 화면')).toBeInTheDocument();
  });
});
