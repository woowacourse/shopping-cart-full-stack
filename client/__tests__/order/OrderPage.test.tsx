import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import OrderRoute from '../../src/pages/Order/OrderRoute';
import CheckoutPage from '../../src/pages/checkout/CheckoutPage';
import { server } from '../../src/mocks/server';

function renderOrderPage() {
  return render(
    <MemoryRouter initialEntries={['/order/order-1']}>
      <Routes>
        <Route path="/order/:id" element={<OrderRoute />} />
        <Route path="/payment-checkout" element={<CheckoutPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('OrderPage', () => {
  test('주문서 조회 중에는 로딩 스피너를 보여준다.', () => {
    server.use(
      http.get('/orders/:id', async () => {
        await delay(100);

        return HttpResponse.json(null);
      }),
    );

    renderOrderPage();

    expect(screen.getByRole('status', { name: '로딩 중' })).toBeInTheDocument();
  });

  test('주문서 조회 성공 시 주문 상품과 결제 금액을 보여준다.', async () => {
    renderOrderPage();

    expect(await screen.findByText('상품이름A')).toBeInTheDocument();
    expect(screen.getByText('상품이름B')).toBeInTheDocument();
    expect(
      screen.getByText(/총 2종류의 상품 4개를 주문합니다./),
    ).toBeInTheDocument();
    expect(screen.getByText('120,000원')).toBeInTheDocument();
    expect(screen.getByText('-5,000원')).toBeInTheDocument();
    expect(screen.getByText('115,000원')).toBeInTheDocument();
  });

  test('주문서 조회 실패 시 에러 메시지를 보여준다.', async () => {
    server.use(
      http.get('/orders/:id', () => {
        return HttpResponse.json(null, { status: 404 });
      }),
    );

    renderOrderPage();

    expect(
      await screen.findByText('주문서를 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });

  test('도서 산간 지역을 선택하면 배송 정보를 수정하고 주문서를 다시 조회한다.', async () => {
    let isRemoteArea = false;
    let requestBody: unknown;

    server.use(
      http.get('/orders/:id', () => {
        return HttpResponse.json({
          products: [
            {
              productId: 'product-a',
              name: '상품이름A',
              price: 35000,
              image: null,
              quantity: 2,
            },
          ],
          isRemoteArea,
          amount: {
            orderAmount: 70000,
            discountAmount: isRemoteArea ? 6000 : 3000,
            shippingFee: isRemoteArea ? 6000 : 3000,
            totalAmount: 70000,
          },
        });
      }),
      http.patch('/orders/:id', async ({ request }) => {
        requestBody = await request.json();
        await delay(100);
        isRemoteArea = true;

        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderOrderPage();

    const checkbox = await screen.findByRole('checkbox', {
      name: '제주도 및 도서 산간 지역',
    });

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();

    await waitFor(() => {
      expect(requestBody).toEqual({ isRemoteArea: true });
      expect(screen.getByText('-6,000원')).toBeInTheDocument();
      expect(screen.getByText('6,000원')).toBeInTheDocument();
    });
  });

  test('배송 정보 수정 실패 시 기존 주문서를 유지한다.', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    try {
      server.use(
        http.patch('/orders/:id', () => {
          return HttpResponse.json(null, { status: 500 });
        }),
      );

      renderOrderPage();

      const checkbox = await screen.findByRole('checkbox', {
        name: '제주도 및 도서 산간 지역',
      });

      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          '배송 정보를 변경하지 못했습니다.',
        );
        expect(checkbox).not.toBeChecked();
      });
    } finally {
      alertSpy.mockRestore();
    }
  });

  test('쿠폰 적용 버튼을 누르면 쿠폰 목록을 조회하고 기존 선택 상태를 표시한다.', async () => {
    renderOrderPage();

    await screen.findByText('상품이름A');
    fireEvent.click(screen.getByRole('button', { name: '쿠폰 적용' }));

    expect(await screen.findByText('5,000원 할인 쿠폰')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: '5,000원 할인 쿠폰' }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: '2개 구매 시 1개 무료 쿠폰' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('checkbox', {
        name: '미라클모닝 30% 할인 쿠폰',
      }),
    ).toBeDisabled();
  });

  test('쿠폰 선택을 변경하면 할인 금액을 계산해 모달 버튼에 표시한다.', async () => {
    let requestBody: unknown;

    server.use(
      http.post('/orders/:id/coupons/discount', async ({ request }) => {
        requestBody = await request.json();
        await delay(100);

        return HttpResponse.json({ discountAmount: 10000 });
      }),
    );

    renderOrderPage();

    await screen.findByText('상품이름A');
    fireEvent.click(screen.getByRole('button', { name: '쿠폰 적용' }));

    const freeShippingCoupon = await screen.findByRole('checkbox', {
      name: '5만원 이상 구매 시 무료 배송 쿠폰',
    });
    fireEvent.click(freeShippingCoupon);

    expect(freeShippingCoupon).toBeChecked();

    await waitFor(() => {
      expect(requestBody).toEqual({
        coupons: ['FIXED5000', 'FREESHIPPING'],
      });
      expect(
        screen.getByRole('button', {
          name: '총 10,000원 할인 쿠폰 사용하기',
        }),
      ).toBeInTheDocument();
    });
  });

  test('쿠폰 할인 계산 실패 시 이전 선택 상태로 되돌린다.', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    try {
      server.use(
        http.post('/orders/:id/coupons/discount', async () => {
          await delay(50);

          return HttpResponse.json(null, { status: 500 });
        }),
      );

      renderOrderPage();

      await screen.findByText('상품이름A');
      fireEvent.click(screen.getByRole('button', { name: '쿠폰 적용' }));

      const freeShippingCoupon = await screen.findByRole('checkbox', {
        name: '5만원 이상 구매 시 무료 배송 쿠폰',
      });
      fireEvent.click(freeShippingCoupon);

      expect(freeShippingCoupon).toBeChecked();

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          '쿠폰 할인 금액을 계산하지 못했습니다.',
        );
        expect(freeShippingCoupon).not.toBeChecked();
      });
    } finally {
      alertSpy.mockRestore();
    }
  });

  test('쿠폰 사용하기를 누르면 선택 쿠폰을 주문에 적용하고 모달을 닫는다.', async () => {
    let requestBody: unknown;

    server.use(
      http.patch('/orders/:id/coupons', async ({ request }) => {
        requestBody = await request.json();

        return new HttpResponse(null, { status: 204 });
      }),
    );

    renderOrderPage();

    await screen.findByText('상품이름A');
    fireEvent.click(screen.getByRole('button', { name: '쿠폰 적용' }));

    const applyButton = await screen.findByRole('button', {
      name: '총 5,000원 할인 쿠폰 사용하기',
    });

    await waitFor(() => {
      expect(applyButton).toBeEnabled();
    });

    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(requestBody).toEqual({ coupons: ['FIXED5000'] });
      expect(
        screen.queryByText('쿠폰을 선택해 주세요'),
      ).not.toBeInTheDocument();
    });
  });

  test('결제하기를 누르면 상품 종류, 상품 수량, 총 결제 금액을 전달한다.', async () => {
    renderOrderPage();

    await screen.findByText('상품이름A');
    fireEvent.click(screen.getByRole('button', { name: '결제하기' }));

    expect(await screen.findByText('결제 확인')).toBeInTheDocument();
    expect(
      screen.getByText(/총 2종류의 상품 4개를 주문했습니다./),
    ).toBeInTheDocument();
    expect(screen.getByText('115,000원')).toBeInTheDocument();
  });
});
