import { render, screen } from '@testing-library/react';
import { delay, HttpResponse, http } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import PaymentAmountPage from '../payment/PaymentAmountPage';
import { server } from '../mocks/server';
import type { OrderSheet, OrderSheetPricing } from '../apis/orderSheet';

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
      quantity: 2,
    },
    {
      product: {
        id: 'product-2',
        name: '양말',
        thumbnail: 'https://placehold.co/211x211?text=Socks',
        price: 20_000,
      },
      quantity: 1,
    },
  ],
};

const pricing: OrderSheetPricing = {
  orderAmount: 40_000,
  shippingFee: 3_000,
  discountAmount: 0,
  totalPaymentAmount: 43_000,
};

const renderPaymentAmountPage = () => {
  return render(
    <MemoryRouter initialEntries={['/payment/order-sheet-1']}>
      <Routes>
        <Route path="/payment/:orderSheetId" element={<PaymentAmountPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('PaymentAmountPage', () => {
  test('서버에서 조회한 주문 정보와 결제 금액을 보여준다.', async () => {
    server.use(
      http.get('/api/order-sheets/:orderSheetId/', () => {
        return HttpResponse.json({ orderSheet });
      }),
      http.get('/api/order-sheets/:orderSheetId/pricing/', () => {
        return HttpResponse.json({ pricing });
      }),
    );

    renderPaymentAmountPage();

    expect(await screen.findByText('결제 확인')).toBeInTheDocument();
    expect(screen.getByText(/총\s*2종류의 상품\s*3개를 주문합니다\./)).toBeInTheDocument();
    expect(screen.getByText('43,000원')).toBeInTheDocument();
  });

  test('서버 조회 중에는 로딩 상태를 보여준다.', async () => {
    server.use(
      http.get('/api/order-sheets/:orderSheetId/', async () => {
        await delay(100);

        return HttpResponse.json({ orderSheet });
      }),
      http.get('/api/order-sheets/:orderSheetId/pricing/', async () => {
        await delay(100);

        return HttpResponse.json({ pricing });
      }),
    );

    renderPaymentAmountPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByText('결제 확인')).toBeInTheDocument();
  });

  test('서버 조회에 실패하면 에러 메시지를 보여준다.', async () => {
    server.use(
      http.get('/api/order-sheets/:orderSheetId/', () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );

    renderPaymentAmountPage();

    const alert = await screen.findByRole('alert');

    expect(alert).toHaveTextContent('주문 정보를 불러오지 못했습니다.');
  });
});
