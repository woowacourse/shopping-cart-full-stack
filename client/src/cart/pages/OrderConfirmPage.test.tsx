import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import {OrderConfirmPage} from './OrderConfirmPage.js';
import {CartProvider} from '../hooks/useCart.js';
import type {CartItem} from '../domain/types.js';
import {mockServer} from '../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';
const SELECTED_CART_ITEM_IDS_STORAGE_KEY = 'shopping-cart-selected-cart-item-ids';

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
});

function mockGetCartItems(items: CartItem[]) {
  mockServer.use(
    http.get(`${API_BASE_URL}/carts`, () => {
      return HttpResponse.json({body: items});
    })
  );
}

function renderOrderConfirmPage() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <OrderConfirmPage />
      </CartProvider>
    </MemoryRouter>
  );
}

function renderOrderConfirmRoutes() {
  return render(
    <MemoryRouter initialEntries={['/order-confirm']}>
      <CartProvider>
        <Routes>
          <Route path='/cart' element={<div>장바구니 화면</div>} />
          <Route path='/order-confirm' element={<OrderConfirmPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('OrderConfirmPage', () => {
  test('선택된 장바구니 상품 기준으로 주문 확인 정보를 보여준다', async () => {
    localStorage.setItem(SELECTED_CART_ITEM_IDS_STORAGE_KEY, JSON.stringify(['cart-1']));
    mockGetCartItems(cartItems);

    renderOrderConfirmPage();

    expect(await screen.findByRole('heading', {name: '주문 확인'})).toBeInTheDocument();
    expect(screen.getByText(/총 1종류의 상품 2개를 주문합니다/)).toBeInTheDocument();
    expect(screen.getByText(/최종 결제 금액을 확인해 주세요/)).toBeInTheDocument();
    expect(screen.getByText('23,000원')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '결제하기'})).toBeDisabled();
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

    renderOrderConfirmPage();

    expect(screen.getByRole('status', {name: '장바구니를 불러오는 중입니다.'})).toBeInTheDocument();

    resolveRequest();

    await screen.findByRole('heading', {name: '주문 확인'});
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

    renderOrderConfirmPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('장바구니를 불러오지 못했습니다.');

    await user.click(screen.getByRole('button', {name: '다시 시도'}));

    expect(await screen.findByRole('heading', {name: '주문 확인'})).toBeInTheDocument();
    expect(requestCount).toBe(2);
  });

  test('뒤로가기 버튼을 누르면 장바구니 페이지로 이동한다', async () => {
    const user = userEvent.setup();

    mockGetCartItems(cartItems);

    renderOrderConfirmRoutes();

    await user.click(screen.getByRole('button', {name: '장바구니로 돌아가기'}));

    expect(screen.getByText('장바구니 화면')).toBeInTheDocument();
  });
});
