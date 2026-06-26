import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, delay, http } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test } from 'vitest';
import { server } from '../mocks/server';
import CartPage from '../cart/CartPage';
import type { CartItemResponse } from '../apis/cart';

const cartItems: CartItemResponse[] = [
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
];

const renderCartPage = () => {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>,
  );
};

const mockCartItems = (items: CartItemResponse[]) => {
  server.use(
    http.get('/api/cart/', () => {
      return HttpResponse.json({ items });
    }),
  );
};

describe('CartPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('장바구니 상품 목록과 주문 금액 요약을 보여준다.', async () => {
    mockCartItems(cartItems);

    renderCartPage();

    expect(await screen.findByText('운동화')).toBeInTheDocument();
    expect(screen.getByText('양말')).toBeInTheDocument();
    expect(
      screen.getByText('현재 2종류의 상품이 담겨있습니다.'),
    ).toBeInTheDocument();

    const summary = screen.getByRole('region', { name: '주문 금액 요약' });
    await waitFor(() => {
      expect(within(summary).getByText('40,000원')).toBeInTheDocument();
    });
    expect(within(summary).getByText('3,000원')).toBeInTheDocument();
    expect(within(summary).getByText('43,000원')).toBeInTheDocument();
  });

  test('장바구니 상품 목록을 불러오는 동안 로딩 상태를 보여준다.', async () => {
    server.use(
      http.get('/api/cart/', async () => {
        await delay(100);

        return HttpResponse.json({ items: cartItems });
      }),
    );

    renderCartPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByText('운동화')).toBeInTheDocument();
  });

  test('장바구니 상품 목록 조회에 실패하면 에러 메시지를 보여준다.', async () => {
    server.use(
      http.get('/api/cart/', () => {
        return HttpResponse.json(null, { status: 500 });
      }),
    );

    renderCartPage();

    const alert = await screen.findByRole('alert');

    expect(alert).toHaveTextContent('장바구니 상품을 불러오지 못했습니다.');
  });

  test('장바구니 상품이 없으면 빈 장바구니 메시지를 보여준다.', async () => {
    mockCartItems([]);

    renderCartPage();

    expect(
      await screen.findByText('장바구니에 담은 상품이 없습니다.'),
    ).toBeInTheDocument();
  });

  test('수량 증가 버튼을 누르면 상품 수량과 주문 금액을 갱신한다.', async () => {
    mockCartItems([cartItems[0]]);
    server.use(
      http.patch('/api/cart/items/:productId/', async ({ params, request }) => {
        const { quantity } = (await request.json()) as { quantity: number };

        return HttpResponse.json({
          product_id: params.productId,
          quantity,
        });
      }),
    );

    const user = userEvent.setup();
    renderCartPage();

    expect(await screen.findByText('운동화')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '증가' }));

    expect(await screen.findByText('3')).toBeInTheDocument();
    expect(screen.getByText('30,000원')).toBeInTheDocument();
    expect(screen.getByText('33,000원')).toBeInTheDocument();
  });

  test('삭제 버튼을 누르면 해당 상품을 장바구니에서 제거한다.', async () => {
    mockCartItems(cartItems);
    server.use(
      http.delete('/api/cart/items/:productId/', () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const user = userEvent.setup();
    renderCartPage();

    expect(await screen.findByText('운동화')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: '삭제' })[0]);

    await waitFor(() => {
      expect(screen.queryByText('운동화')).not.toBeInTheDocument();
    });
    expect(
      screen.getByText('현재 1종류의 상품이 담겨있습니다.'),
    ).toBeInTheDocument();
  });
});
