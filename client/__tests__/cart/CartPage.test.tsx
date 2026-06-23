import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { MemoryRouter, useLocation } from 'react-router-dom';

import {
  deleteCartItem,
  fetchCartItems,
  updateAllCartItemsSelection,
  updateCartItemSelection,
  updateCartItemQuantity,
} from '../../src/entities/cart/api/cartApi';
import CartPage from '../../src/pages/cart/CartPage';
import CartProvider from '../../src/pages/cart/providers/CartProvider';
import { mockCartItems } from '../../src/mocks/handlers';
import { server } from '../../src/mocks/server';

function CurrentPath() {
  const location = useLocation();

  return <span data-testid="current-path">{location.pathname}</span>;
}

function renderCartPage() {
  return render(
    <MemoryRouter>
      <CartProvider
        fetchItems={fetchCartItems}
        updateItemQuantity={updateCartItemQuantity}
        updateItemSelection={updateCartItemSelection}
        updateAllItemsSelection={updateAllCartItemsSelection}
        removeItem={deleteCartItem}
      >
        <CartPage />
      </CartProvider>
      <CurrentPath />
    </MemoryRouter>,
  );
}

describe('CartPage', () => {
  test('장바구니 조회 중에는 로딩 스피너를 보여준다.', () => {
    server.use(
      http.get('/carts', async () => {
        await delay(100);

        return HttpResponse.json([]);
      }),
    );

    renderCartPage();

    expect(screen.getByRole('status', { name: '로딩 중' })).toBeInTheDocument();
  });

  test('장바구니 조회 실패 시 에러 메시지를 보여준다.', async () => {
    server.use(
      http.get('/carts', () => {
        return HttpResponse.json(
          { message: '장바구니 조회 실패' },
          { status: 500 },
        );
      }),
    );

    renderCartPage();

    expect(
      await screen.findByText('장바구니 목록을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });

  test('장바구니 조회 성공 시 상품 목록과 주문 금액을 보여준다.', async () => {
    renderCartPage();

    expect(await screen.findByText('장바구니')).toBeInTheDocument();
    expect(screen.getByText('상품이름A')).toBeInTheDocument();
    expect(screen.getByText('상품이름B')).toBeInTheDocument();
    expect(
      screen.getByText('현재 2종류의 상품이 담겨있습니다.'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('120,000원')).toHaveLength(2);
  });

  test('수량 증가 버튼을 누르면 상품 수량과 주문 금액이 증가한다.', async () => {
    renderCartPage();

    const firstItem = await screen.findByText('상품이름A');
    const firstCartItem = firstItem.closest('li');

    expect(firstCartItem).not.toBeNull();

    fireEvent.click(
      within(firstCartItem as HTMLElement).getByRole('button', { name: '+' }),
    );

    await waitFor(() => {
      expect(
        within(firstCartItem as HTMLElement).getByText('3'),
      ).toBeInTheDocument();
    });
    expect(screen.getAllByText('155,000원')).toHaveLength(2);
  });

  test('수량 감소 버튼을 누르면 상품 수량과 주문 금액이 감소한다.', async () => {
    renderCartPage();

    const firstItem = await screen.findByText('상품이름A');
    const firstCartItem = firstItem.closest('li');

    expect(firstCartItem).not.toBeNull();

    fireEvent.click(
      within(firstCartItem as HTMLElement).getByRole('button', { name: '-' }),
    );

    await waitFor(() => {
      expect(
        within(firstCartItem as HTMLElement).getByText('1'),
      ).toBeInTheDocument();
    });
    expect(screen.getByText('85,000원')).toBeInTheDocument();
    expect(screen.getByText('88,000원')).toBeInTheDocument();
  });

  test('수량 변경 실패 시 에러 메시지를 alert로 보여주고 이전 수량으로 되돌린다.', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    try {
      server.use(
        http.patch('/carts/:id', () => {
          return HttpResponse.json(null, { status: 500 });
        }),
      );

      renderCartPage();

      const firstItem = await screen.findByText('상품이름A');
      const firstCartItem = firstItem.closest('li');

      expect(firstCartItem).not.toBeNull();

      fireEvent.click(
        within(firstCartItem as HTMLElement).getByRole('button', {
          name: '+',
        }),
      );

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          '상품 수량을 변경하지 못했습니다.',
        );
      });
      expect(
        within(firstCartItem as HTMLElement).getByText('2'),
      ).toBeInTheDocument();
    } finally {
      alertSpy.mockRestore();
    }
  });

  test('최소 수량에서 감소 버튼을 눌러도 수량이 1보다 작아지지 않는다.', async () => {
    server.use(
      http.get('/carts', () => {
        return HttpResponse.json([
          {
            ...mockCartItems[0],
            quantity: 1,
          },
        ]);
      }),
    );

    renderCartPage();

    const firstItem = await screen.findByText('상품이름A');
    const firstCartItem = firstItem.closest('li');

    expect(firstCartItem).not.toBeNull();

    fireEvent.click(
      within(firstCartItem as HTMLElement).getByRole('button', { name: '-' }),
    );

    await waitFor(() => {
      expect(
        within(firstCartItem as HTMLElement).getByText('1'),
      ).toBeInTheDocument();
    });
  });

  test('최대 수량에서 증가 버튼을 눌러도 수량이 99보다 커지지 않는다.', async () => {
    server.use(
      http.get('/carts', () => {
        return HttpResponse.json([
          {
            ...mockCartItems[0],
            quantity: 99,
          },
        ]);
      }),
    );

    renderCartPage();

    const firstItem = await screen.findByText('상품이름A');
    const firstCartItem = firstItem.closest('li');

    expect(firstCartItem).not.toBeNull();

    fireEvent.click(
      within(firstCartItem as HTMLElement).getByRole('button', { name: '+' }),
    );

    await waitFor(() => {
      expect(
        within(firstCartItem as HTMLElement).getByText('99'),
      ).toBeInTheDocument();
    });
  });

  test('상품 삭제 버튼을 누르면 해당 상품이 목록에서 사라진다.', async () => {
    renderCartPage();

    const firstItem = await screen.findByText('상품이름A');
    const firstCartItem = firstItem.closest('li');

    expect(firstCartItem).not.toBeNull();

    fireEvent.click(
      within(firstCartItem as HTMLElement).getByRole('button', {
        name: '삭제',
      }),
    );

    await waitFor(() => {
      expect(screen.queryByText('상품이름A')).not.toBeInTheDocument();
    });
    expect(screen.getByText('상품이름B')).toBeInTheDocument();
  });

  test('상품 삭제 실패 시 에러 메시지를 alert로 보여준다.', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    try {
      server.use(
        http.delete('/carts/:id', () => {
          return HttpResponse.json(null, { status: 500 });
        }),
      );

      renderCartPage();

      const firstItem = await screen.findByText('상품이름A');
      const firstCartItem = firstItem.closest('li');

      expect(firstCartItem).not.toBeNull();

      fireEvent.click(
        within(firstCartItem as HTMLElement).getByRole('button', {
          name: '삭제',
        }),
      );

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('상품을 삭제하지 못했습니다.');
      });
      expect(screen.getByText('상품이름A')).toBeInTheDocument();
    } finally {
      alertSpy.mockRestore();
    }
  });

  test('선택된 상품이 없으면 주문 확인 버튼이 비활성화된다.', async () => {
    renderCartPage();

    const selectAllCheckbox = await screen.findByRole('checkbox', {
      name: '전체선택',
    });

    fireEvent.click(selectAllCheckbox);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '주문 확인' })).toBeDisabled();
    });
  });

  test('선택된 상품이 있으면 주문 확인 버튼이 활성화된다.', async () => {
    renderCartPage();

    const selectAllCheckbox = await screen.findByRole('checkbox', {
      name: '전체선택',
    });
    fireEvent.click(selectAllCheckbox);

    const firstItem = await screen.findByText('상품이름A');
    const firstCartItem = firstItem.closest('li');

    fireEvent.click(within(firstCartItem as HTMLElement).getByRole('checkbox'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '주문 확인' })).toBeEnabled();
    });
  });

  test('주문 확인 버튼을 누르면 선택된 상품으로 주문을 생성하고 주문 페이지로 이동한다.', async () => {
    let requestBody: unknown;

    server.use(
      http.post('/orders', async ({ request }) => {
        requestBody = await request.json();

        return HttpResponse.json({ id: 'created-order-id' }, { status: 201 });
      }),
    );

    renderCartPage();

    const firstItem = await screen.findByText('상품이름A');
    const firstCartItem = firstItem.closest('li');

    fireEvent.click(within(firstCartItem as HTMLElement).getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: '주문 확인' }));

    await waitFor(() => {
      expect(requestBody).toEqual({
        items: [{ productId: 'product-b', quantity: 2 }],
      });
      expect(screen.getByTestId('current-path')).toHaveTextContent(
        '/order/created-order-id',
      );
    });
  });

  test('주문 생성 실패 시 에러 메시지를 보여주고 장바구니 페이지에 머문다.', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    try {
      server.use(
        http.post('/orders', () => {
          return HttpResponse.json(null, { status: 500 });
        }),
      );

      renderCartPage();

      await screen.findByText('상품이름A');
      fireEvent.click(screen.getByRole('button', { name: '주문 확인' }));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('주문을 생성하지 못했습니다.');
        expect(screen.getByTestId('current-path')).toHaveTextContent('/');
      });
    } finally {
      alertSpy.mockRestore();
    }
  });

  test('상품 선택을 해제하면 선택된 상품 기준으로 주문 금액을 보여준다.', async () => {
    renderCartPage();

    const firstItem = await screen.findByText('상품이름A');
    const firstCartItem = firstItem.closest('li');

    expect(firstCartItem).not.toBeNull();

    fireEvent.click(within(firstCartItem as HTMLElement).getByRole('checkbox'));

    await waitFor(() => {
      expect(screen.getByText('50,000원')).toBeInTheDocument();
    });
    expect(screen.getByText('53,000원')).toBeInTheDocument();
  });

  test('상품 선택 상태 변경 실패 시 이전 상태로 되돌린다.', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    try {
      server.use(
        http.patch('/carts/:id', () => {
          return HttpResponse.json(null, { status: 500 });
        }),
      );

      renderCartPage();

      const firstItem = await screen.findByText('상품이름A');
      const firstCartItem = firstItem.closest('li');
      const checkbox = within(
        firstCartItem as HTMLElement,
      ).getByRole('checkbox');

      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          '상품 선택 상태를 변경하지 못했습니다.',
        );
        expect(checkbox).toBeChecked();
      });
    } finally {
      alertSpy.mockRestore();
    }
  });

  test('전체 선택 상태 변경 실패 시 이전 상태로 되돌린다.', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    try {
      server.use(
        http.patch('/carts', () => {
          return HttpResponse.json(null, { status: 500 });
        }),
      );

      renderCartPage();

      const selectAllCheckbox = await screen.findByRole('checkbox', {
        name: '전체선택',
      });

      fireEvent.click(selectAllCheckbox);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          '전체 상품 선택 상태를 변경하지 못했습니다.',
        );
        expect(selectAllCheckbox).toBeChecked();
      });
    } finally {
      alertSpy.mockRestore();
    }
  });

  test('서버에서 받은 상품 선택 상태를 화면에 반영한다.', async () => {
    server.use(
      http.get('/carts', () => {
        return HttpResponse.json([
          { ...mockCartItems[0], isSelected: false },
          mockCartItems[1],
        ]);
      }),
    );

    renderCartPage();

    const firstItem = await screen.findByText('상품이름A');
    const secondItem = screen.getByText('상품이름B');
    const firstCartItem = firstItem.closest('li');
    const secondCartItem = secondItem.closest('li');

    expect(
      within(firstCartItem as HTMLElement).getByRole('checkbox'),
    ).not.toBeChecked();
    expect(
      within(secondCartItem as HTMLElement).getByRole('checkbox'),
    ).toBeChecked();
    expect(screen.getByText('50,000원')).toBeInTheDocument();
  });
});
