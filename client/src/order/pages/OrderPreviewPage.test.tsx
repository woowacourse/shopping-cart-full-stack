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

function mockGetCoupons() {
  mockServer.use(
    http.get(`${API_BASE_URL}/coupons`, () => {
      return HttpResponse.json({
        body: {
          coupons: [
            {
              couponId: 1,
              code: 'FIXED5000',
              name: '5,000원 할인 쿠폰',
              expirationDate: '2026-11-30T14:59:59.000Z',
              condition: {
                description: '최소 주문 금액: 100,000원',
              },
              disabled: false,
              disabledReason: null,
            },
            {
              couponId: 2,
              code: 'BOGO',
              name: '2개 구매 시 1개 무료 쿠폰',
              expirationDate: '2026-06-30T14:59:59.000Z',
              condition: {
                description: null,
              },
              disabled: true,
              disabledReason: '동일 상품을 2개 이상 구매해야 합니다.',
            },
            {
              couponId: 3,
              code: 'FREESHIPPING',
              name: '5만원 이상 구매 시 무료 배송 쿠폰',
              expirationDate: '2026-08-31T14:59:59.000Z',
              condition: {
                description: '최소 주문 금액: 50,000원',
              },
              disabled: false,
              disabledReason: null,
            },
            {
              couponId: 4,
              code: 'MIRACLESALE',
              name: '미라클모닝 30% 할인 쿠폰',
              expirationDate: '2026-07-31T14:59:59.000Z',
              condition: {
                description: '사용 가능 시간: 오전 4시부터 오전 7시까지',
              },
              disabled: false,
              disabledReason: null,
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
    mockGetCoupons();

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
    mockGetCoupons();

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
    mockGetCoupons();
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
    mockGetCoupons();

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
    mockGetCoupons();

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
    mockGetCoupons();

    renderOrderPreviewPage();

    expect(await screen.findByText('주문 확인 정보를 불러오지 못했습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '다시 시도'})).toBeInTheDocument();
  });

  test('쿠폰 적용 버튼을 누르면 쿠폰 모달을 보여준다', async () => {
    const user = userEvent.setup();

    mockGetPreorder();
    mockGetCoupons();

    renderOrderPreviewPage();

    await screen.findByText('상품이름A');
    await user.click(screen.getByRole('button', {name: '쿠폰 적용'}));

    expect(screen.getByRole('heading', {name: '쿠폰을 선택해 주세요'})).toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: '5,000원 할인 쿠폰'})).toBeInTheDocument();
    expect(screen.getByText('최소 주문 금액: 100,000원')).toBeInTheDocument();
    expect(screen.getByText('사용 가능 시간: 오전 4시부터 오전 7시까지')).toBeInTheDocument();
    expect(screen.queryByText('동일 상품 2개 이상 구매')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: '2개 구매 시 1개 무료 쿠폰'})).toBeDisabled();
  });

  test('쿠폰은 최대 2개까지 선택할 수 있다', async () => {
    const user = userEvent.setup();

    mockGetPreorder();
    mockGetCoupons();

    renderOrderPreviewPage();

    await screen.findByText('상품이름A');
    await user.click(screen.getByRole('button', {name: '쿠폰 적용'}));
    await user.click(screen.getByRole('checkbox', {name: '5,000원 할인 쿠폰'}));
    await user.click(screen.getByRole('checkbox', {name: '5만원 이상 구매 시 무료 배송 쿠폰'}));

    expect(screen.getByRole('checkbox', {name: '5,000원 할인 쿠폰'})).toBeChecked();
    expect(screen.getByRole('checkbox', {name: '5만원 이상 구매 시 무료 배송 쿠폰'})).toBeChecked();
    expect(screen.getByRole('checkbox', {name: '미라클모닝 30% 할인 쿠폰'})).toBeDisabled();
    expect(screen.getByRole('button', {name: '총 0원 할인 쿠폰 사용하기'})).toBeInTheDocument();
  });

  test('쿠폰 선택 적용 버튼을 누르면 모달을 닫는다', async () => {
    const user = userEvent.setup();

    mockGetPreorder();
    mockGetCoupons();

    renderOrderPreviewPage();

    await screen.findByText('상품이름A');
    await user.click(screen.getByRole('button', {name: '쿠폰 적용'}));
    await user.click(screen.getByRole('button', {name: '×'}));

    expect(screen.queryByRole('heading', {name: '쿠폰을 선택해 주세요'})).not.toBeInTheDocument();
  });
});
