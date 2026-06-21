import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import OrderPreviewPage from './OrderPreviewPage.js';
import {OrderConfirmPage} from '../../order/pages/OrderConfirmPage.js';
import {OrderPreviewProvider} from '../providers/OrderPreviewProvider.js';
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
          recommendedCouponIds: [1, 3],
        },
      });
    })
  );
}

function mockPreviewOrder(requestBodies: unknown[] = []) {
  mockServer.use(
    http.post(`${API_BASE_URL}/order/preview`, async ({request}) => {
      const requestBody = await request.json();
      requestBodies.push(requestBody);

      const {couponIds, isRemoteArea} = requestBody as {couponIds: number[]; isRemoteArea: boolean};
      const orderAmount = 70000;
      const productDiscountAmount = couponIds.includes(1) ? 5000 : 0;
      const shippingFeeBeforeDiscount = isRemoteArea ? 6000 : 3000;
      const shippingDiscountAmount = couponIds.includes(3) ? shippingFeeBeforeDiscount : 0;
      const shippingFee = shippingFeeBeforeDiscount - shippingDiscountAmount;
      const totalDiscountAmount = productDiscountAmount + shippingDiscountAmount;

      return HttpResponse.json({
        body: {
          price: {
            orderAmount,
            productDiscountAmount,
            shippingDiscountAmount,
            totalDiscountAmount,
            shippingFee,
            totalPaymentAmount: orderAmount - productDiscountAmount + shippingFee,
          },
          appliedCoupons: [],
          excludedCoupons: [],
        },
      });
    })
  );
}

function mockCreateOrder(requestBodies: unknown[] = []) {
  mockServer.use(
    http.post(`${API_BASE_URL}/order`, async ({request}) => {
      const requestBody = await request.json();
      requestBodies.push(requestBody);

      return HttpResponse.json({body: {orderId: 'order-1'}}, {status: 201});
    })
  );
}

function mockGetOrderSummary() {
  mockServer.use(
    http.get(`${API_BASE_URL}/order/order-1`, () => {
      return HttpResponse.json({
        body: {
          itemCount: 1,
          totalQuantity: 2,
          totalAmount: 73000,
        },
      });
    })
  );
}

function renderOrderPreviewPage(initialEntry = '/order-preview/preorder-1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path='/order-preview/:preorderId'
          element={
            <OrderPreviewProvider>
              <OrderPreviewPage />
            </OrderPreviewProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

function renderOrderPreviewRoutes() {
  return render(
    <MemoryRouter initialEntries={['/order-preview/preorder-1']}>
      <Routes>
        <Route path='/cart' element={<div>장바구니 화면</div>} />
        <Route
          path='/order-preview/:preorderId'
          element={
            <OrderPreviewProvider>
              <OrderPreviewPage />
            </OrderPreviewProvider>
          }
        />
        <Route path='/order-confirm/:orderId' element={<OrderConfirmPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('OrderPreviewPage', () => {
  test('preorderId 기준으로 주문 확인 정보를 보여준다', async () => {
    const requestBodies: unknown[] = [];

    mockGetPreorder();
    mockGetCoupons();
    mockPreviewOrder(requestBodies);

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
    expect(screen.getByRole('button', {name: '결제하기'})).toBeEnabled();
    expect(requestBodies).toContainEqual({
      preorderId: 'preorder-1',
      isRemoteArea: false,
      couponIds: [],
    });
  });

  test('도서산간 지역을 선택하면 배송비와 결제 금액을 다시 보여준다', async () => {
    const user = userEvent.setup();
    const requestBodies: unknown[] = [];

    mockGetPreorder();
    mockGetCoupons();
    mockPreviewOrder(requestBodies);

    renderOrderPreviewPage();

    await screen.findByText('상품이름A');

    await user.click(screen.getByRole('checkbox', {name: '제주도 및 도서 산간 지역'}));

    expect(screen.getByRole('checkbox', {name: '제주도 및 도서 산간 지역'})).toBeChecked();
    expect(await screen.findByText('6,000원')).toBeInTheDocument();
    expect(screen.getByText('76,000원')).toBeInTheDocument();
    expect(requestBodies).toContainEqual({
      preorderId: 'preorder-1',
      isRemoteArea: true,
      couponIds: [],
    });
  });

  test('뒤로가기 버튼을 누르면 장바구니 페이지로 이동한다', async () => {
    const user = userEvent.setup();

    mockGetPreorder();
    mockGetCoupons();
    mockPreviewOrder();
    renderOrderPreviewRoutes();

    await screen.findByText('상품이름A');

    await user.click(screen.getByRole('button', {name: '뒤로가기'}));

    expect(screen.getByText('장바구니 화면')).toBeInTheDocument();
  });

  test('결제하기 버튼을 누르면 현재 결제 금액으로 주문을 생성하고 결제 확인 페이지로 이동한다', async () => {
    const user = userEvent.setup();
    const requestBodies: unknown[] = [];

    mockGetPreorder();
    mockGetCoupons();
    mockPreviewOrder();
    mockCreateOrder(requestBodies);
    mockGetOrderSummary();
    renderOrderPreviewRoutes();

    await screen.findByText('상품이름A');
    await user.click(screen.getByRole('button', {name: '결제하기'}));

    expect(await screen.findByRole('heading', {name: '결제 확인'})).toBeInTheDocument();
    expect(requestBodies).toEqual([
      {
        preorderId: 'preorder-1',
        expectedTotalPaymentAmount: 73000,
      },
    ]);
  });

  test('주문 생성에 실패하면 서버 에러 메시지를 보여주고 다시 결제할 수 있다', async () => {
    const user = userEvent.setup();

    mockGetPreorder();
    mockGetCoupons();
    mockPreviewOrder();
    mockGetOrderSummary();
    mockServer.use(
      http.post(`${API_BASE_URL}/order`, () => {
        return HttpResponse.json(
          {
            body: {
              message: '서버에서 다시 계산한 결제 금액이 화면에 표시된 금액과 일치하지 않습니다.',
            },
          },
          {status: 409}
        );
      })
    );
    renderOrderPreviewPage();

    await screen.findByText('상품이름A');
    await user.click(screen.getByRole('button', {name: '결제하기'}));

    expect(
      await screen.findByText('서버에서 다시 계산한 결제 금액이 화면에 표시된 금액과 일치하지 않습니다.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '결제하기'})).toBeEnabled();
  });

  test('주문 생성 요청 중에는 결제 버튼을 잠가 중복 요청을 막는다', async () => {
    const user = userEvent.setup();
    const requestBodies: unknown[] = [];
    let resolveOrder: (() => void) | undefined;

    mockGetPreorder();
    mockGetCoupons();
    mockPreviewOrder();
    mockGetOrderSummary();
    mockServer.use(
      http.post(`${API_BASE_URL}/order`, async ({request}) => {
        requestBodies.push(await request.json());

        return new Promise((resolve) => {
          resolveOrder = () => resolve(HttpResponse.json({body: {orderId: 'order-1'}}, {status: 201}));
        });
      })
    );
    renderOrderPreviewRoutes();

    await screen.findByText('상품이름A');
    await user.click(screen.getByRole('button', {name: '결제하기'}));

    expect(screen.getByRole('button', {name: '결제 중'})).toBeDisabled();

    await user.click(screen.getByRole('button', {name: '결제 중'}));

    expect(requestBodies).toHaveLength(1);

    resolveOrder?.();

    expect(await screen.findByRole('heading', {name: '결제 확인'})).toBeInTheDocument();
  });

  test('주문 확인 정보가 만료되면 장바구니로 돌아갈 수 있다', async () => {
    const user = userEvent.setup();

    mockServer.use(
      http.get(`${API_BASE_URL}/preorder/preorder-1`, () => {
        return HttpResponse.json({body: {message: '주문 확인 시간이 만료되었습니다.'}}, {status: 410});
      })
    );
    mockGetCoupons();
    mockPreviewOrder();

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
    mockPreviewOrder();

    renderOrderPreviewRoutes();

    expect(await screen.findByText('주문 확인 정보를 찾을 수 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '장바구니로 돌아가기'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {name: '주문 확인'})).not.toBeInTheDocument();
    expect(screen.queryByText(/총 0종류의 상품 0개를 주문합니다/)).not.toBeInTheDocument();
  });

  test('일시적인 오류면 다시 시도할 수 있다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/preorder/preorder-1`, () => {
        return HttpResponse.json({body: {message: '주문 확인 정보를 불러오지 못했습니다.'}}, {status: 500});
      })
    );
    mockGetCoupons();
    mockPreviewOrder();

    renderOrderPreviewPage();

    expect(await screen.findByText('주문 확인 정보를 불러오지 못했습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '다시 시도'})).toBeInTheDocument();
  });

  test('쿠폰 적용 버튼을 누르면 쿠폰 모달을 보여준다', async () => {
    const user = userEvent.setup();

    mockGetPreorder();
    mockGetCoupons();
    mockPreviewOrder();

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

  test('쿠폰 모달을 처음 열면 추천 쿠폰이 자동 선택된다', async () => {
    const user = userEvent.setup();
    const requestBodies: unknown[] = [];

    mockGetPreorder();
    mockGetCoupons();
    mockPreviewOrder(requestBodies);

    renderOrderPreviewPage();

    await screen.findByText('상품이름A');
    await user.click(screen.getByRole('button', {name: '쿠폰 적용'}));

    expect(await screen.findByRole('checkbox', {name: '5,000원 할인 쿠폰'})).toBeChecked();
    expect(await screen.findByRole('checkbox', {name: '5만원 이상 구매 시 무료 배송 쿠폰'})).toBeChecked();
    expect(screen.getByRole('checkbox', {name: '미라클모닝 30% 할인 쿠폰'})).toBeDisabled();
    expect(await screen.findByRole('button', {name: '총 8,000원 할인 쿠폰 사용하기'})).toBeInTheDocument();
    expect(screen.getByText('73,000원')).toBeInTheDocument();
    expect(requestBodies).toContainEqual({
      preorderId: 'preorder-1',
      isRemoteArea: false,
      couponIds: [1, 3],
    });
  });

  test('쿠폰 선택 적용 버튼을 누르면 모달을 닫고 주문 금액에 반영한다', async () => {
    const user = userEvent.setup();

    mockGetPreorder();
    mockGetCoupons();
    mockPreviewOrder();

    renderOrderPreviewPage();

    await screen.findByText('상품이름A');
    await user.click(screen.getByRole('button', {name: '쿠폰 적용'}));
    await user.click(await screen.findByRole('button', {name: '총 8,000원 할인 쿠폰 사용하기'}));

    expect(screen.queryByRole('heading', {name: '쿠폰을 선택해 주세요'})).not.toBeInTheDocument();
    expect(await screen.findByText('65,000원')).toBeInTheDocument();
  });
});
