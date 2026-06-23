import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import CheckoutPage from '../../src/pages/checkout/CheckoutPage';
import type { CheckoutState } from '../../src/entities/order/types';

function renderCheckoutPage(state?: CheckoutState) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/payment-checkout', state }]}>
      <CheckoutPage />
    </MemoryRouter>,
  );
}

describe('CheckoutPage', () => {
  test('전달받은 결제 요약 정보를 보여준다.', () => {
    renderCheckoutPage({
      productTypeCount: 2,
      productCount: 4,
      totalAmount: 115000,
    });

    expect(
      screen.getByText(/총 2종류의 상품 4개를 주문했습니다./),
    ).toBeInTheDocument();
    expect(screen.getByText('115,000원')).toBeInTheDocument();
  });

  test('결제 요약 정보 없이 접근하면 기본값을 보여준다.', () => {
    renderCheckoutPage();

    expect(
      screen.getByText(/총 0종류의 상품 0개를 주문했습니다./),
    ).toBeInTheDocument();
    expect(screen.getByText('0원')).toBeInTheDocument();
  });
});
