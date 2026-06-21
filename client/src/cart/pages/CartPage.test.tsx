import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import {CartPage} from './CartPage.js';
import {CartProvider} from '../providers/CartProvider.js';
import type {CartItem} from '../domain/types.js';
import OrderPreviewPage from '../../order/pages/OrderPreviewPage.js';
import {mockServer} from '../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

const cartItems: CartItem[] = [
  {
    id: 'cart-1',
    productInfo: {id: 'product-hoodie', name: '후드 집업', price: 10000, imageUrl: '/hoodie.png'},
    quantity: 2,
  },
  {
    id: 'cart-2',
    productInfo: {id: 'product-denim', name: '데님 팬츠', price: 100000, imageUrl: '/denim-pants.png'},
    quantity: 1,
  },
];

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

function mockGetCartItems(items: CartItem[]) {
  mockServer.use(
    http.get(`${API_BASE_URL}/carts`, () => {
      return HttpResponse.json({body: items});
    })
  );
}

function renderCartPage() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </MemoryRouter>
  );
}

function renderCartRoutes() {
  return render(
    <MemoryRouter initialEntries={['/cart']}>
      <CartProvider>
        <Routes>
          <Route path='/cart' element={<CartPage />} />
          <Route path='/order-preview' element={<OrderPreviewPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('CartPage', () => {
  test('선택한 장바구니 상품 기준으로 결제 요약과 하단 결제 버튼을 보여준다', async () => {
    const user = userEvent.setup();

    mockGetCartItems(cartItems);

    renderCartPage();

    await screen.findByText('현재 2종류의 상품이 담겨있습니다.');

    expect(screen.getByText('총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.')).toBeInTheDocument();
    expect(screen.getByText('주문 금액')).toBeInTheDocument();
    expect(screen.getByText('배송비')).toBeInTheDocument();
    expect(screen.getByText('0원')).toBeInTheDocument();
    expect(screen.getByText('총 결제 금액')).toBeInTheDocument();
    expect(screen.getAllByText('120,000원')).toHaveLength(2);
    expect(screen.getByRole('button', {name: '주문 확인'})).toBeEnabled();

    await user.click(screen.getByLabelText('전체 선택'));

    await waitFor(() => {
      expect(screen.getByRole('button', {name: '주문 확인'})).toBeDisabled();
    });

    expect(screen.getAllByText('0원')).toHaveLength(3);
  });

  test('장바구니 상품을 불러오는 중이면 스피너를 보여준다', async () => {
    let resolveRequest: () => void = () => {};
    const pendingRequest = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });

    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, async () => {
        await pendingRequest;

        return HttpResponse.json({body: cartItems});
      })
    );

    renderCartPage();

    expect(screen.queryByText('현재 2종류의 상품이 담겨있습니다.')).not.toBeInTheDocument();

    resolveRequest();

    await screen.findByText('현재 2종류의 상품이 담겨있습니다.');
  });

  test('장바구니 상품을 불러오지 못하면 에러 메시지를 보여주고 다시 시도할 수 있다', async () => {
    const user = userEvent.setup();
    let requestCount = 0;

    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        requestCount += 1;

        if (requestCount === 1) {
          return HttpResponse.json({body: {message: '장바구니를 불러오지 못했습니다.'}}, {status: 500});
        }

        return HttpResponse.json({body: cartItems});
      })
    );

    renderCartPage();

    expect(await screen.findByText('장바구니를 불러오지 못했습니다.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: '다시 시도'}));

    await screen.findByText('현재 2종류의 상품이 담겨있습니다.');
    expect(requestCount).toBe(2);
  });

  test('장바구니가 비어 있으면 안내 문구와 비활성 주문 버튼을 보여준다', async () => {
    mockGetCartItems([]);

    renderCartPage();

    expect(await screen.findByText('장바구니에 담은 상품이 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '주문 확인'})).toBeDisabled();
    expect(screen.queryByText('현재 0종류의 상품이 담겨있습니다.')).not.toBeInTheDocument();
  });

  test('장바구니 상품 삭제를 확인하면 화면에서 해당 상품을 제거한다', async () => {
    const user = userEvent.setup();
    let deletedCartItemId: string | null = null;

    mockGetCartItems(cartItems);
    mockServer.use(
      http.delete(`${API_BASE_URL}/carts/:cartItemId`, ({params}) => {
        deletedCartItemId = params.cartItemId as string;

        return new HttpResponse(null, {status: 204});
      })
    );
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    renderCartPage();

    await screen.findByText('현재 2종류의 상품이 담겨있습니다.');

    await user.click(screen.getAllByRole('button', {name: '삭제'})[0]);

    await waitFor(() => {
      expect(screen.queryByText('후드 집업')).not.toBeInTheDocument();
    });

    expect(deletedCartItemId).toBe('cart-1');
    expect(screen.getByText('현재 1종류의 상품이 담겨있습니다.')).toBeInTheDocument();
    expect(screen.getByText('데님 팬츠')).toBeInTheDocument();

    expect(screen.getAllByText('100,000원', {selector: 'span'})).toHaveLength(2);
  });

  test('주문 확인 버튼을 누르면 주문 확인 페이지로 이동한다', async () => {
    const user = userEvent.setup();
    let requestCount = 0;

    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        requestCount += 1;

        return HttpResponse.json({body: cartItems});
      })
    );

    renderCartRoutes();

    await screen.findByText('현재 2종류의 상품이 담겨있습니다.');

    await user.click(screen.getByRole('button', {name: '주문 확인'}));

    expect(await screen.findByRole('heading', {name: '주문 확인'})).toBeInTheDocument();
    expect(screen.getByText(/총 1종류의 상품 2개를 주문합니다/)).toBeInTheDocument();
    expect(screen.getByText(/최종 결제 금액을 확인해 주세요/)).toBeInTheDocument();
    expect(screen.getByText('상품이름A')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '결제하기'})).toBeInTheDocument();
    expect(requestCount).toBe(1);
  });
});
