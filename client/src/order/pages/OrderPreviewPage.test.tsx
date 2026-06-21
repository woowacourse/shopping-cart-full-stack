import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import OrderPreviewPage from './OrderPreviewPage.js';
import {OrderConfirmPage} from './OrderConfirmPage.js';

function renderOrderPreviewPage() {
  return render(
    <MemoryRouter>
      <OrderPreviewPage />
    </MemoryRouter>
  );
}

function renderOrderPreviewRoutes() {
  return render(
    <MemoryRouter initialEntries={['/order-preview']}>
      <Routes>
        <Route path='/cart' element={<div>장바구니 화면</div>} />
        <Route path='/order-preview' element={<OrderPreviewPage />} />
        <Route path='/order-confirm' element={<OrderConfirmPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('OrderPreviewPage', () => {
  test('주문 확인 화면 껍데기를 보여준다', () => {
    renderOrderPreviewPage();

    expect(screen.getByRole('heading', {name: '주문 확인'})).toBeInTheDocument();
    expect(screen.getByText(/총 1종류의 상품 2개를 주문합니다/)).toBeInTheDocument();
    expect(screen.getByText('상품이름A')).toBeInTheDocument();
    expect(screen.getByText('35,000원')).toBeInTheDocument();
    expect(screen.getByText('2개')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '쿠폰 적용'})).toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: '제주도 및 도서 산간 지역'})).toBeChecked();

    const paymentSummary = screen.getByRole('region', {name: '결제 요약'});

    expect(within(paymentSummary).getByText('주문 금액')).toBeInTheDocument();
    expect(within(paymentSummary).getByText('쿠폰 할인 금액')).toBeInTheDocument();
    expect(within(paymentSummary).getByText('배송비')).toBeInTheDocument();
    expect(within(paymentSummary).getByText('총 결제 금액')).toBeInTheDocument();
    expect(within(paymentSummary).getAllByText('70,000원')).toHaveLength(2);
    expect(within(paymentSummary).getByText('-6,000원')).toBeInTheDocument();
    expect(within(paymentSummary).getByText('6,000원')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '결제하기'})).toBeInTheDocument();
  });

  test('뒤로가기 버튼을 누르면 장바구니 페이지로 이동한다', async () => {
    const user = userEvent.setup();

    renderOrderPreviewRoutes();

    await user.click(screen.getByRole('button', {name: '뒤로가기'}));

    expect(screen.getByText('장바구니 화면')).toBeInTheDocument();
  });

  test('결제하기 버튼을 누르면 결제 확인 페이지로 이동한다', async () => {
    const user = userEvent.setup();

    renderOrderPreviewRoutes();

    await user.click(screen.getByRole('button', {name: '결제하기'}));

    expect(screen.getByRole('heading', {name: '결제 확인'})).toBeInTheDocument();
  });
});
