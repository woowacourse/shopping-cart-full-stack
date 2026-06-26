import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, delay, http } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import type { OrderSheet, OrderSheetPricing } from '../apis/orderSheet';
import OrderConfirmPage from '../order/OrderConfirmPage';
import { server } from '../mocks/server';

const orderSheet: OrderSheet = {
  id: 'order-sheet-1',
  isRemoteShippingArea: false,
  selectedCouponIds: [],
  items: [
    {
      product: {
        id: 'product-1',
        name: '운동화',
        thumbnail: 'https://placehold.co/211x211?text=Sneakers',
        price: 10_000,
      },
      quantity: 1,
    },
  ],
};

const basePricing: OrderSheetPricing = {
  orderAmount: 10_000,
  shippingFee: 3_000,
  discountAmount: 0,
  totalPaymentAmount: 13_000,
};

const remoteShippingPricing: OrderSheetPricing = {
  ...basePricing,
  shippingFee: 6_000,
  totalPaymentAmount: 16_000,
};

const renderOrderConfirmPage = () => {
  return render(
    <MemoryRouter initialEntries={['/order-confirm/order-sheet-1']}>
      <Routes>
        <Route
          path="/order-confirm/:orderSheetId"
          element={<OrderConfirmPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

const mockOrderSheet = () => {
  server.use(
    http.get('/api/order-sheets/:orderSheetId/', () => {
      return HttpResponse.json({ orderSheet });
    }),
    http.patch('/api/order-sheets/:orderSheetId/shipping-area/', () => {
      return new HttpResponse(null, { status: 204 });
    }),
  );
};

describe('OrderConfirmPage', () => {
  test('주문서와 결제 금액을 모두 불러올 때까지 전체 로딩 상태를 보여준다.', async () => {
    mockOrderSheet();
    server.use(
      http.get('/api/order-sheets/:orderSheetId/pricing/', async () => {
        await delay(100);

        return HttpResponse.json({ pricing: basePricing });
      }),
    );

    renderOrderConfirmPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('운동화')).not.toBeInTheDocument();
    expect(await screen.findByText('운동화')).toBeInTheDocument();
  });

  test('결제 금액을 재조회하는 동안 금액 영역에만 로딩 상태를 보여준다.', async () => {
    mockOrderSheet();
    let pricingRequestCount = 0;
    server.use(
      http.get('/api/order-sheets/:orderSheetId/pricing/', async () => {
        pricingRequestCount += 1;

        if (pricingRequestCount > 1) {
          await delay(100);

          return HttpResponse.json({ pricing: remoteShippingPricing });
        }

        return HttpResponse.json({ pricing: basePricing });
      }),
    );

    const user = userEvent.setup();
    renderOrderConfirmPage();

    expect(await screen.findByText('운동화')).toBeInTheDocument();
    expect(screen.getByText('13,000원')).toBeInTheDocument();

    await user.click(
      screen.getByRole('checkbox', { name: '제주도 및 도서 산간 지역' }),
    );

    const summary = screen.getByRole('region', { name: '결제 금액 요약' });
    expect(
      within(summary).getByRole('status', { name: '결제 금액 갱신 중' }),
    ).toBeInTheDocument();
    expect(screen.getByText('운동화')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        within(
          screen.getByRole('region', { name: '결제 금액 요약' }),
        ).getByText('16,000원'),
      ).toBeInTheDocument();
    });
  });

  test('결제 금액 재조회에 실패하면 금액 영역에 에러 메시지를 보여준다.', async () => {
    mockOrderSheet();
    let pricingRequestCount = 0;
    server.use(
      http.get('/api/order-sheets/:orderSheetId/pricing/', () => {
        pricingRequestCount += 1;

        if (pricingRequestCount > 1) {
          return HttpResponse.json(null, { status: 500 });
        }

        return HttpResponse.json({ pricing: basePricing });
      }),
    );

    const user = userEvent.setup();
    renderOrderConfirmPage();

    expect(await screen.findByText('운동화')).toBeInTheDocument();

    await user.click(
      screen.getByRole('checkbox', { name: '제주도 및 도서 산간 지역' }),
    );

    const summary = screen.getByRole('region', { name: '결제 금액 요약' });
    const alert = await within(summary).findByRole('alert');

    expect(alert).toHaveTextContent('결제 금액을 불러오지 못했습니다.');
    expect(within(summary).queryByText('13,000원')).not.toBeInTheDocument();
  });
});
