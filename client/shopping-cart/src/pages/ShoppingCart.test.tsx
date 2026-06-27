import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { http, HttpResponse } from 'msw';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ShoppingCart from './ShoppingCart';
import AppLayout from '../components/layout/AppLayout';
import { server } from '../mocks/server';

const renderShoppingCart = () => {
  render(
    <BrowserRouter>
      <AppLayout>
        <ShoppingCart />
      </AppLayout>
    </BrowserRouter>,
  );
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('ShoppingCart', () => {
  it('장바구니 목록을 불러온다', async () => {
    renderShoppingCart();
    await waitFor(() => {
      expect(screen.getByText('데일리 라운드 티셔츠')).toBeInTheDocument();
      expect(screen.getByText('와이드 데님 팬츠')).toBeInTheDocument();
    });
  });

  it('장바구니에 담긴 상품 종류의 수를 표시한다', async () => {
    renderShoppingCart();
    await waitFor(() => {
      expect(screen.getByText('현재 3 종류의 상품이 담겨있습니다.')).toBeInTheDocument();
    });
  });

  it('상품 수량 변경이 실패하면 기존 수량을 유지한다', async () => {
    server.use(
      http.patch('http://localhost:3000/carts/products/:productId', () => {
        return HttpResponse.json({ message: 'error' }, { status: 500 });
      }),
    );

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderShoppingCart();
    const cartItem = await screen.findByText('데일리 라운드 티셔츠');
    const cartItemRow = cartItem.closest('li');

    expect(cartItemRow).not.toBeNull();
    if (!cartItemRow) return;

    const quantityText = within(cartItemRow).getAllByText(/^\d+$/)[0];
    const initialQuantity = quantityText.textContent;
    const buttons = within(cartItemRow).getAllByRole('button');
    const increaseButton = buttons[3];

    await userEvent.click(increaseButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    expect(quantityText.textContent).toBe(initialQuantity);
  });
});
