import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import OrderPreviewPage from './OrderPreviewPage.js';
import {OrderConfirmPage} from './OrderConfirmPage.js';
import {mockServer} from '../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

function mockGetPreorder() {
  mockServer.use(
    http.get(`${API_BASE_URL}/preorder/preorder-1`, () => {
      return HttpResponse.json({
        body: {
          preorderId: 'preorder-1',
          items: [
            {
              productId: 'product-a',
              name: '상품이름A',
              price: 35000,
              imageUrl: '/product-a.png',
              quantity: 2,
            },
          ],
        },
      });
    })
  );
}

function renderOrderPreviewPage(initialEntry = '/order-preview/preorder-1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path='/order-preview/:preorderId' element={<OrderPreviewPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderOrderPreviewRoutes() {
  return render(
    <MemoryRouter initialEntries={['/order-preview/preorder-1']}>
      <Routes>
        <Route path='/cart' element={<div>장바구니 화면</div>} />
        <Route path='/order-preview/:preorderId' element={<OrderPreviewPage />} />
        <Route path='/order-confirm' element={<OrderConfirmPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('OrderPreviewPage', () => {
  test('preorderId 기준으로 주문 확인 정보를 보여준다', async () => {
    mockGetPreorder();

    renderOrderPreviewPage();

    expect(await screen.findByRole('heading', {name: '주문 확인'})).toBeInTheDocument();
    expect(await screen.findByText(/총 1종류의 상품 2개를 주문합니다/)).toBeInTheDocument();
    expect(screen.getByText('상품이름A')).toBeInTheDocument();
    expect(screen.getByText('35,000원')).toBeInTheDocument();
    expect(screen.getByText('2개')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '쿠폰 적용'})).toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: '제주도 및 도서 산간 지역'})).not.toBeChecked();

    expect(screen.getByText('주문 금액')).toBeInTheDocument();
    expect(screen.getByText('쿠폰 할인 금액')).toBeInTheDocument();
    expect(screen.getByText('배송비')).toBeInTheDocument();
    expect(screen.getByText('총 결제 금액')).toBeInTheDocument();
    expect(screen.getByText('70,000원')).toBeInTheDocument();
    expect(screen.getByText('0원')).toBeInTheDocument();
    expect(screen.getByText('3,000원')).toBeInTheDocument();
    expect(screen.getByText('73,000원')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '결제하기'})).toBeDisabled();
  });

  test('도서산간 지역을 선택하면 배송비와 결제 금액을 다시 보여준다', async () => {
    const user = userEvent.setup();

    mockGetPreorder();

    renderOrderPreviewPage();

    await screen.findByText('상품이름A');

    await user.click(screen.getByRole('checkbox', {name: '제주도 및 도서 산간 지역'}));

    expect(screen.getByRole('checkbox', {name: '제주도 및 도서 산간 지역'})).toBeChecked();
    expect(screen.getByText('6,000원')).toBeInTheDocument();
    expect(screen.getByText('76,000원')).toBeInTheDocument();
  });

  test('뒤로가기 버튼을 누르면 장바구니 페이지로 이동한다', async () => {
    const user = userEvent.setup();

    mockGetPreorder();
    renderOrderPreviewRoutes();

    await screen.findByText('상품이름A');

    await user.click(screen.getByRole('button', {name: '뒤로가기'}));

    expect(screen.getByText('장바구니 화면')).toBeInTheDocument();
  });

  test('주문 확인 정보가 만료되면 장바구니로 돌아갈 수 있다', async () => {
    const user = userEvent.setup();

    mockServer.use(
      http.get(`${API_BASE_URL}/preorder/preorder-1`, () => {
        return HttpResponse.json({body: {message: '주문 확인 시간이 만료되었습니다.'}}, {status: 410});
      })
    );

    renderOrderPreviewRoutes();

    expect(await screen.findByText('주문 확인 시간이 만료되었습니다.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: '장바구니로 돌아가기'}));

    expect(screen.getByText('장바구니 화면')).toBeInTheDocument();
  });

  test('주문 확인 정보가 없으면 장바구니로 돌아갈 수 있다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/preorder/preorder-1`, () => {
        return HttpResponse.json({body: {message: '주문 확인 정보를 찾을 수 없습니다.'}}, {status: 404});
      })
    );

    renderOrderPreviewRoutes();

    expect(await screen.findByText('주문 확인 정보를 찾을 수 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '장바구니로 돌아가기'})).toBeInTheDocument();
  });

  test('일시적인 오류면 다시 시도할 수 있다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/preorder/preorder-1`, () => {
        return HttpResponse.json({body: {message: '주문 확인 정보를 불러오지 못했습니다.'}}, {status: 500});
      })
    );

    renderOrderPreviewPage();

    expect(await screen.findByText('주문 확인 정보를 불러오지 못했습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '다시 시도'})).toBeInTheDocument();
  });
});
