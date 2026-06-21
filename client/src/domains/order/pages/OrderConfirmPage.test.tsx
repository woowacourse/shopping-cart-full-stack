import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import {OrderConfirmPage} from './OrderConfirmPage.js';
import {mockServer} from '../../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

function mockGetOrderSummary() {
  mockServer.use(
    http.get(`${API_BASE_URL}/order/order-1`, () => {
      return HttpResponse.json({
        body: {
          itemCount: 1,
          totalQuantity: 2,
          totalAmount: 70000,
        },
      });
    })
  );
}

function renderOrderConfirmPage() {
  return render(
    <MemoryRouter initialEntries={['/order-confirm/order-1']}>
      <Routes>
        <Route path='/order-confirm/:orderId' element={<OrderConfirmPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderOrderConfirmRoutes() {
  return render(
    <MemoryRouter initialEntries={['/order-confirm/order-1']}>
      <Routes>
        <Route path='/cart' element={<div>장바구니 화면</div>} />
        <Route path='/order-confirm/:orderId' element={<OrderConfirmPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('OrderConfirmPage', () => {
  test('orderId 기준으로 결제 확인 정보를 보여준다', async () => {
    mockGetOrderSummary();

    renderOrderConfirmPage();

    expect(await screen.findByRole('heading', {name: '결제 확인'})).toBeInTheDocument();
    expect(screen.getByText(/총 1종류의 상품 2개를 주문했습니다/)).toBeInTheDocument();
    expect(screen.getByText(/최종 결제 금액을 확인해 주세요/)).toBeInTheDocument();
    expect(screen.getByText('총 결제 금액')).toBeInTheDocument();
    expect(screen.getByText('70,000원')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '장바구니로 돌아가기'})).toBeInTheDocument();
  });

  test('주문 요약 정보를 불러오는 중이면 스피너를 보여준다', async () => {
    let resolveRequest: () => void = () => {};
    const pendingRequest = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });

    mockServer.use(
      http.get(`${API_BASE_URL}/order/order-1`, async () => {
        await pendingRequest;

        return HttpResponse.json({
          body: {
            itemCount: 1,
            totalQuantity: 2,
            totalAmount: 70000,
          },
        });
      })
    );

    renderOrderConfirmPage();

    expect(screen.queryByRole('heading', {name: '결제 확인'})).not.toBeInTheDocument();

    resolveRequest();

    expect(await screen.findByRole('heading', {name: '결제 확인'})).toBeInTheDocument();
  });

  test('주문 요약 정보를 불러오지 못하면 다시 시도할 수 있다', async () => {
    const user = userEvent.setup();
    let requestCount = 0;

    mockServer.use(
      http.get(`${API_BASE_URL}/order/order-1`, () => {
        requestCount += 1;

        if (requestCount === 1) {
          return HttpResponse.json({body: {message: '주문 정보를 찾을 수 없습니다.'}}, {status: 404});
        }

        return HttpResponse.json({
          body: {
            itemCount: 1,
            totalQuantity: 2,
            totalAmount: 70000,
          },
        });
      })
    );

    renderOrderConfirmPage();

    expect(await screen.findByText('주문 정보를 찾을 수 없습니다.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: '다시 시도'}));

    expect(await screen.findByRole('heading', {name: '결제 확인'})).toBeInTheDocument();
    expect(requestCount).toBe(2);
  });

  test('장바구니로 돌아가기 버튼을 누르면 장바구니 페이지로 이동한다', async () => {
    const user = userEvent.setup();

    mockGetOrderSummary();
    renderOrderConfirmRoutes();

    await screen.findByRole('heading', {name: '결제 확인'});
    await user.click(screen.getByRole('button', {name: '장바구니로 돌아가기'}));

    expect(screen.getByText('장바구니 화면')).toBeInTheDocument();
  });
});
