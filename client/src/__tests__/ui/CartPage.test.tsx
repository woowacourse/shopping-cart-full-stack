import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import { API_BASE_URL } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { CartProvider } from "../../pages/CartPage/CartContext";
import CartPage from "../../pages/CartPage/CartPage";
import { CartSelectionProvider } from "../../pages/CartPage/CartSelectionContext";
import OrderConfirmPage from "../../pages/OrderCompletePage/OrderCompletePage";

const cartItems = [
  {
    id: 1,
    name: "테스트 상품 1",
    price: 10000,
    imgUrl: undefined,
    itemCount: 1,
  },
  {
    id: 2,
    name: "테스트 상품 2",
    price: 95000,
    imgUrl: undefined,
    itemCount: 2,
  },
];

const renderCartPage = () => {
  return render(
    <MemoryRouter>
      <CartProvider cartId={1}>
        <CartSelectionProvider>
          <CartPage />
        </CartSelectionProvider>
      </CartProvider>
    </MemoryRouter>,
  );
};

const renderCartFlow = () => {
  return render(
    <MemoryRouter initialEntries={["/cart"]}>
      <Routes>
        <Route
          path="/cart"
          element={
            <CartProvider cartId={1}>
              <CartSelectionProvider>
                <CartPage />
              </CartSelectionProvider>
            </CartProvider>
          }
        />
        <Route path="/cart/order-confirm" element={<OrderConfirmPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

const mockCartItemsResponse = (items: typeof cartItems) => {
  server.use(
    http.get(`${API_BASE_URL}/carts/:cartId/items`, () => {
      return HttpResponse.json({
        code: 200,
        message: "요청에 성공했습니다.",
        result: {
          cartItems: items,
        },
      });
    }),
  );
};

const mockCartItemsState = (items: typeof cartItems) => {
  let currentItems = structuredClone(items);

  server.use(
    http.get(`${API_BASE_URL}/carts/:cartId/items`, () => {
      return HttpResponse.json({
        code: 200,
        message: "요청에 성공했습니다.",
        result: {
          cartItems: currentItems,
        },
      });
    }),
    http.patch(
      `${API_BASE_URL}/carts/:cartId/items/:productId`,
      async ({ params, request }) => {
        const productId = Number(params.productId);
        const { itemCount } = (await request.json()) as { itemCount: number };

        currentItems = currentItems.map((item) =>
          item.id === productId ? { ...item, itemCount } : item,
        );

        return HttpResponse.json({
          code: 200,
          message: "요청에 성공했습니다.",
          result: {
            id: productId,
            itemCount,
          },
        });
      },
    ),
    http.delete(
      `${API_BASE_URL}/carts/:cartId/items/:productId`,
      ({ params }) => {
        const productId = Number(params.productId);
        currentItems = currentItems.filter((item) => item.id !== productId);

        return new HttpResponse(null, { status: 204 });
      },
    ),
  );
};

const getCartCheckboxes = async () => {
  await screen.findByText("테스트 상품 1");

  const [allSelectCheckbox, ...itemCheckboxes] = screen.getAllByRole(
    "checkbox",
  ) as HTMLInputElement[];

  return { allSelectCheckbox, itemCheckboxes };
};

const getSummaryRow = (name: string) => {
  return screen.getByRole("row", { name: new RegExp(name) });
};

describe("CartPage", () => {
  test("data fetch하는 동안 로딩중...이 표시된다", () => {
    server.use(
      http.get(`${API_BASE_URL}/carts/:cartId/items`, async () => {
        await delay("infinite");
        return HttpResponse.json();
      }),
    );

    renderCartPage();

    expect(screen.getByText("로딩중...")).toBeInTheDocument();
  });

  test("카트정보 데이터 목록이 1개 이상 존재하면 상품이 표시된다", async () => {
    renderCartPage();

    expect(await screen.findByText("테스트 상품 1")).toBeInTheDocument();
  });

  test("상품 목록이 비어있을 시 장바구니 빈 상태 메시지가 표시된다", async () => {
    mockCartItemsResponse([]);

    renderCartPage();

    expect(
      await screen.findByText("장바구니에 담은 상품이 없습니다."),
    ).toBeInTheDocument();
  });

  test("요청 실패 시 실패 메시지가 표시된다", async () => {
    server.use(
      http.get(`${API_BASE_URL}/carts/:cartId/items`, () => {
        return HttpResponse.json(
          {
            code: "CART_ITEMS_FETCH_FAILED",
            message: "장바구니 정보를 불러오지 못했습니다.",
          },
          { status: 500 },
        );
      }),
    );

    renderCartPage();

    expect(
      await screen.findByText("장바구니 정보를 불러오지 못했습니다."),
    ).toBeInTheDocument();
  });

  test("빈 전체 선택 버튼을 누르면 상품 목록의 체크박스가 전부 체크된다", async () => {
    const user = userEvent.setup();
    mockCartItemsResponse(cartItems);
    renderCartPage();
    const { allSelectCheckbox, itemCheckboxes } = await getCartCheckboxes();

    await user.click(allSelectCheckbox);
    await user.click(allSelectCheckbox);

    expect(allSelectCheckbox).toBeChecked();
    itemCheckboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  test("체크된 전체 선택 버튼을 누르면 상품 목록의 체크박스가 전부 해제된다", async () => {
    const user = userEvent.setup();
    mockCartItemsResponse(cartItems);
    renderCartPage();
    const { allSelectCheckbox, itemCheckboxes } = await getCartCheckboxes();

    await user.click(allSelectCheckbox);

    expect(allSelectCheckbox).not.toBeChecked();
    itemCheckboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  test("개별 상품 목록의 체크박스를 누르면 선택 또는 해제된다", async () => {
    const user = userEvent.setup();
    mockCartItemsResponse(cartItems);
    renderCartPage();
    const { itemCheckboxes } = await getCartCheckboxes();
    const [firstItemCheckbox] = itemCheckboxes;

    await user.click(firstItemCheckbox);
    expect(firstItemCheckbox).not.toBeChecked();

    await user.click(firstItemCheckbox);
    expect(firstItemCheckbox).toBeChecked();
  });

  test("모든 개별 상품 목록을 체크하면 전체 선택 체크박스가 체크된다", async () => {
    const user = userEvent.setup();
    mockCartItemsResponse(cartItems);
    renderCartPage();
    const { allSelectCheckbox, itemCheckboxes } = await getCartCheckboxes();

    await user.click(allSelectCheckbox);
    await user.click(itemCheckboxes[0]);
    await user.click(itemCheckboxes[1]);

    expect(allSelectCheckbox).toBeChecked();
  });

  test("상품 1개라도 체크박스가 해제되면 전체 체크박스가 해제된다", async () => {
    const user = userEvent.setup();
    mockCartItemsResponse(cartItems);
    renderCartPage();
    const { allSelectCheckbox, itemCheckboxes } = await getCartCheckboxes();

    await user.click(itemCheckboxes[0]);

    expect(allSelectCheckbox).not.toBeChecked();
  });

  test("수량이 1일 때는 -버튼을 눌러도 수량이 감소하지 않는다", async () => {
    const user = userEvent.setup();
    mockCartItemsState([cartItems[0]]);
    renderCartPage();

    await screen.findByText("테스트 상품 1");
    await user.click(screen.getByRole("button", { name: "-" }));

    expect(getSummaryRow("주문 금액")).toHaveTextContent("10,000원");
  });

  test("- 또는 + 버튼을 누르면 상품 수량이 1씩 증가하거나 감소한다", async () => {
    const user = userEvent.setup();
    mockCartItemsState([cartItems[0]]);
    renderCartPage();

    await screen.findByText("테스트 상품 1");
    await user.click(screen.getByRole("button", { name: "+" }));
    await waitFor(() => {
      expect(getSummaryRow("주문 금액")).toHaveTextContent("20,000원");
    });

    await user.click(screen.getByRole("button", { name: "-" }));
    await waitFor(() => {
      expect(getSummaryRow("주문 금액")).toHaveTextContent("10,000원");
    });
  });

  test("상품 현재 재고보다 많은 수량을 담을 시 alert 메시지를 띄운다", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    mockCartItemsResponse([cartItems[0]]);
    server.use(
      http.patch(`${API_BASE_URL}/carts/:cartId/items/:productId`, () => {
        return HttpResponse.json(
          {
            code: "PRODUCT_ORDER_COUNT_EXCEEDED",
            message: "보유한 상품의 개수를 넘어섰습니다.",
          },
          { status: 400 },
        );
      }),
    );
    renderCartPage();

    await screen.findByText("테스트 상품 1");
    await user.click(screen.getByRole("button", { name: "+" }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "보유한 상품의 개수를 넘어섰습니다.",
      );
    });
  });

  test("상품 삭제버튼을 눌러 성공하면 상품이 삭제되고 화면이 갱신된다", async () => {
    const user = userEvent.setup();
    mockCartItemsState([cartItems[0]]);
    renderCartPage();

    expect(await screen.findByText("테스트 상품 1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "삭제" }));

    await waitFor(() => {
      expect(screen.queryByText("테스트 상품 1")).not.toBeInTheDocument();
    });
    expect(
      await screen.findByText("장바구니에 담은 상품이 없습니다."),
    ).toBeInTheDocument();
  });

  test("상품 삭제에 실패하면 alert 메시지를 띄운다", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    mockCartItemsResponse([cartItems[0]]);
    server.use(
      http.delete(`${API_BASE_URL}/carts/:cartId/items/:productId`, () => {
        return HttpResponse.json(
          {
            code: "PRODUCT_NOT_EXIST_IN_CART",
            message: "해당 상품이 장바구니에 존재하지 않습니다.",
          },
          { status: 404 },
        );
      }),
    );
    renderCartPage();

    await screen.findByText("테스트 상품 1");
    await user.click(screen.getByRole("button", { name: "삭제" }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "해당 상품이 장바구니에 존재하지 않습니다.",
      );
    });
  });

  test("체크된 상품 수량만큼 현재 주문 금액에 추가된다", async () => {
    const user = userEvent.setup();
    mockCartItemsResponse(cartItems);
    renderCartPage();
    const { itemCheckboxes } = await getCartCheckboxes();

    await user.click(itemCheckboxes[0]);

    expect(getSummaryRow("주문 금액")).toHaveTextContent("190,000원");
  });

  test("주문금액이 100,000원 이상이면 배송비가 0원이 된다", async () => {
    mockCartItemsResponse(cartItems);
    renderCartPage();

    await screen.findByText("테스트 상품 1");

    expect(getSummaryRow("배송비")).toHaveTextContent("0원");
  });

  test("주문금액이 100,000원 미만이면 배송비가 3,000원이 된다", async () => {
    renderCartPage();

    await screen.findByText("테스트 상품 1");

    expect(getSummaryRow("배송비")).toHaveTextContent("3,000원");
  });

  test("주문 금액이 0원이면 주문 확인 버튼이 비활성화 된다", async () => {
    const user = userEvent.setup();
    renderCartPage();
    const { allSelectCheckbox } = await getCartCheckboxes();

    await user.click(allSelectCheckbox);

    expect(screen.getByRole("button", { name: "주문 확인" })).toBeDisabled();
  });

  test("주문확인 버튼을 누르면 주문 확인 페이지로 이동한다", async () => {
    const user = userEvent.setup();
    renderCartFlow();

    await screen.findByText("테스트 상품 1");
    await user.click(screen.getByRole("button", { name: "주문 확인" }));

    expect(
      await screen.findByRole("heading", { name: "주문 확인" }),
    ).toBeInTheDocument();
  });
});
