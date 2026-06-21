import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import {OrderConfirmPage} from './OrderConfirmPage.js';

function renderOrderConfirmPage() {
  return render(
    <MemoryRouter>
      <OrderConfirmPage />
    </MemoryRouter>
  );
}

function renderOrderConfirmRoutes() {
  return render(
    <MemoryRouter initialEntries={['/order-confirm']}>
      <Routes>
        <Route path='/cart' element={<div>장바구니 화면</div>} />
        <Route path='/order-confirm' element={<OrderConfirmPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('OrderConfirmPage', () => {
  test('결제 확인 정보를 보여준다', () => {
    renderOrderConfirmPage();

    expect(screen.getByRole('heading', {name: '결제 확인'})).toBeInTheDocument();
    expect(screen.getByText(/총 1종류의 상품 2개를 주문했습니다/)).toBeInTheDocument();
    expect(screen.getByText(/최종 결제 금액을 확인해 주세요/)).toBeInTheDocument();
    expect(screen.getByText('총 결제 금액')).toBeInTheDocument();
    expect(screen.getByText('70,000원')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '장바구니로 돌아가기'})).toBeInTheDocument();
  });

  test('장바구니로 돌아가기 버튼을 누르면 장바구니 페이지로 이동한다', async () => {
    const user = userEvent.setup();

    renderOrderConfirmRoutes();

    await user.click(screen.getByRole('button', {name: '장바구니로 돌아가기'}));

    expect(screen.getByText('장바구니 화면')).toBeInTheDocument();
  });
});
