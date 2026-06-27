import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay as mswDelay, HttpResponse, http } from "msw";
import { createMemoryRouter } from "react-router";
import { createRoutesFromElements, Route, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";
import type { CartItemsResponseDto } from "../../apis/cart.api.dto";
import { cartItems } from "../../mocks/mockDatabase";
import { server } from "../../test/server";
import CheckoutPage from "../CheckoutPage/CheckoutPage";
import CartPage from "./CartPage";

vi.mock("../../utils/delay", () => ({
  delay: () => Promise.resolve(),
}));

const initialCartItems: CartItemsResponseDto = [
  {
    id: 1,
    productId: 10,
    name: "나이키",
    quantity: 1,
    stock: 10,
    imageUrl: "https://example.com/nike.png",
    price: 60000,
  },
  {
    id: 2,
    productId: 11,
    name: "아디다스",
    quantity: 1,
    stock: 5,
    imageUrl: "https://example.com/adidas.png",
    price: 30000,
  },
];

function resetCartItems(nextItems: CartItemsResponseDto = initialCartItems) {
  cartItems.length = 0;
  cartItems.push(...structuredClone(nextItems));
}

function renderCartPage() {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>,
    ),
  );

  return render(<RouterProvider router={router} />);
}

describe("CartPage", () => {
  beforeEach(() => {
    resetCartItems();
  });

  describe("조회", () => {
    it("로딩 중이면 로딩 화면을 보여준다.", async () => {
      server.use(
        http.get(/\/cart$/, async () => {
          await mswDelay("infinite");
          return HttpResponse.json(initialCartItems);
        }),
      );

      renderCartPage();

      expect(
        await screen.findByRole("status", { name: "장바구니 조회 중" }),
      ).toBeInTheDocument();
    });

    it("조회 성공 시 상품 목록을 보여준다.", async () => {
      renderCartPage();

      expect(await screen.findByText("나이키")).toBeInTheDocument();
      expect(screen.getByText("아디다스")).toBeInTheDocument();

      expect(
        screen.getByText("현재 2종류의 상품이 담겨있습니다."),
      ).toBeInTheDocument();
    });

    it("상품이 없으면 빈 장바구니 화면을 보여준다.", async () => {
      resetCartItems([]);

      renderCartPage();

      expect(
        await screen.findByText("장바구니에 담은 상품이 없습니다."),
      ).toBeInTheDocument();
    });

    it("조회 실패 시 에러 화면을 보여준다.", async () => {
      server.use(
        http.get(/\/cart$/, () =>
          HttpResponse.json(
            {
              code: "CART_FETCH_ERROR",
              message: "장바구니 조회에 실패했습니다.",
            },
            { status: 500 },
          ),
        ),
      );

      renderCartPage();

      expect(
        await screen.findByText("장바구니 조회에 실패했습니다."),
      ).toBeInTheDocument();
    });
  });

  describe("상품 선택", () => {
    it("전체 선택과 전체 해제를 할 수 있다.", async () => {
      renderCartPage();

      await screen.findByText("나이키");

      await userEvent.click(screen.getByRole("button", { name: "전체 선택" }));

      expect(screen.getByRole("button", { name: "주문 확인" })).toBeDisabled();
      expect(screen.getAllByText("0원").length).toBeGreaterThan(0);

      await userEvent.click(screen.getByRole("button", { name: "전체 선택" }));

      expect(
        screen.getByRole("button", { name: "주문 확인" }),
      ).not.toBeDisabled();
      expect(screen.getByText("93,000원")).toBeInTheDocument();
    });

    it("개별 상품을 선택하고 해제할 수 있다.", async () => {
      renderCartPage();

      await screen.findByText("나이키");

      await userEvent.click(
        screen.getByRole("button", { name: "아디다스 선택" }),
      );

      expect(screen.getByText("63,000원")).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole("button", { name: "아디다스 선택" }),
      );

      expect(screen.getByText("93,000원")).toBeInTheDocument();
    });

    it("선택 해제 상태는 새로고침 후에도 유지된다.", async () => {
      const { unmount } = renderCartPage();

      await screen.findByText("나이키");

      await userEvent.click(
        screen.getByRole("button", { name: "아디다스 선택" }),
      );

      expect(screen.getByText("63,000원")).toBeInTheDocument();

      unmount();
      renderCartPage();

      await screen.findByText("나이키");

      expect(screen.getByText("63,000원")).toBeInTheDocument();
    });
  });

  describe("금액 계산", () => {
    it("선택된 상품 기준으로 주문 금액을 계산한다.", async () => {
      renderCartPage();

      await screen.findByText("나이키");

      await userEvent.click(
        screen.getByRole("button", { name: "아디다스 선택" }),
      );

      expect(screen.getAllByText("60,000원").length).toBeGreaterThan(0);
      expect(screen.getByText("3,000원")).toBeInTheDocument();
      expect(screen.getByText("63,000원")).toBeInTheDocument();
    });

    it("주문 금액이 무료배송 기준 이상이면 배송비가 0원이다.", async () => {
      resetCartItems([
        {
          ...initialCartItems[0],
          price: 100000,
        },
        initialCartItems[1],
      ]);

      renderCartPage();

      await screen.findByText("나이키");

      expect(screen.getAllByText("130,000원").length).toBeGreaterThan(0);
      expect(screen.getAllByText("0원").length).toBeGreaterThan(0);
    });

    it("선택된 상품이 없으면 주문 확인 버튼이 비활성화된다.", async () => {
      renderCartPage();

      await screen.findByText("나이키");

      await userEvent.click(screen.getByRole("button", { name: "전체 선택" }));

      expect(screen.getByRole("button", { name: "주문 확인" })).toBeDisabled();
    });
  });

  describe("수량 변경", () => {
    it("+ 버튼을 누르면 수량과 금액이 증가한다.", async () => {
      renderCartPage();

      await screen.findByText("나이키");

      const nikeItem = screen.getByText("나이키").closest("article");
      if (nikeItem === null)
        throw new Error("나이키 상품 영역을 찾을 수 없습니다.");

      await userEvent.click(
        within(nikeItem).getByRole("button", { name: "+" }),
      );

      await waitFor(() => {
        expect(within(nikeItem).getByText("2")).toBeInTheDocument();
        expect(screen.getAllByText("150,000원").length).toBeGreaterThan(0);
        expect(screen.getAllByText("0원").length).toBeGreaterThan(0);
      });
    });

    it("요청 중에는 수정 중 오버레이를 보여준다.", async () => {
      let resolveRequest!: () => void;
      server.use(
        http.patch(/\/cart\/\d+$/, () => {
          return new Promise((resolve) => {
            resolveRequest = () =>
              resolve(new HttpResponse(null, { status: 204 }));
          });
        }),
      );

      renderCartPage();

      await screen.findByText("나이키");

      const nikeItem = screen.getByText("나이키").closest("article");
      if (nikeItem === null)
        throw new Error("나이키 상품 영역을 찾을 수 없습니다.");

      await userEvent.click(
        within(nikeItem).getByRole("button", { name: "+" }),
      );

      expect(
        await screen.findByRole("status", { name: "장바구니 수정 중" }),
      ).toBeInTheDocument();

      resolveRequest();
    });

    it("실패하면 에러 메시지를 보여주고 기존 상태를 유지한다.", async () => {
      resetCartItems([
        {
          ...initialCartItems[0],
          quantity: initialCartItems[0].stock,
        },
        initialCartItems[1],
      ]);

      renderCartPage();

      await screen.findByText("나이키");

      const nikeItem = screen.getByText("나이키").closest("article");
      if (nikeItem === null)
        throw new Error("나이키 상품 영역을 찾을 수 없습니다.");

      await userEvent.click(
        within(nikeItem).getByRole("button", { name: "+" }),
      );

      expect(
        await screen.findByText(/요청한 수량이 현재 재고보다 많습니다/),
      ).toBeInTheDocument();
      expect(within(nikeItem).getByText("10")).toBeInTheDocument();
      expect(screen.getAllByText("630,000원").length).toBeGreaterThan(0);
    });
  });

  describe("상품 삭제", () => {
    it("삭제 성공 시 상품이 화면에서 사라지고 총 금액을 다시 계산한다.", async () => {
      renderCartPage();

      await screen.findByText("나이키");

      const nikeItem = screen.getByText("나이키").closest("article");
      if (nikeItem === null)
        throw new Error("나이키 상품 영역을 찾을 수 없습니다.");

      await userEvent.click(
        within(nikeItem).getByRole("button", { name: "삭제" }),
      );

      await waitFor(() => {
        expect(screen.queryByText("나이키")).not.toBeInTheDocument();
        expect(screen.getByText("33,000원")).toBeInTheDocument();
      });
    });

    it("삭제 실패 시 에러 메시지를 보여주고 상품을 유지한다.", async () => {
      server.use(
        http.delete(/\/cart\/\d+$/, () =>
          HttpResponse.json(
            {
              code: "DELETE_FAILED",
              message: "삭제에 실패했습니다.",
            },
            { status: 500 },
          ),
        ),
      );

      renderCartPage();

      await screen.findByText("나이키");

      const nikeItem = screen.getByText("나이키").closest("article");
      if (nikeItem === null)
        throw new Error("나이키 상품 영역을 찾을 수 없습니다.");

      await userEvent.click(
        within(nikeItem).getByRole("button", { name: "삭제" }),
      );

      expect(
        await screen.findByText(/삭제에 실패했습니다/),
      ).toBeInTheDocument();
      expect(screen.getByText("나이키")).toBeInTheDocument();
    });

    it("모든 상품을 삭제하면 빈 장바구니 화면을 보여준다.", async () => {
      renderCartPage();

      await screen.findByText("나이키");

      const nikeItem = screen.getByText("나이키").closest("article");
      if (nikeItem === null)
        throw new Error("나이키 상품 영역을 찾을 수 없습니다.");

      await userEvent.click(
        within(nikeItem).getByRole("button", { name: "삭제" }),
      );

      const adidasItem = screen.getByText("아디다스").closest("article");
      if (adidasItem === null) {
        throw new Error("아디다스 상품 영역을 찾을 수 없습니다.");
      }

      await userEvent.click(
        within(adidasItem).getByRole("button", { name: "삭제" }),
      );

      expect(
        await screen.findByText("장바구니에 담은 상품이 없습니다."),
      ).toBeInTheDocument();
    });
  });

  describe("주문 확인", () => {
    it("주문 확인 버튼을 누르면 주문 확인 페이지로 이동한다.", async () => {
      renderCartPage();

      await screen.findByText("나이키");

      await userEvent.click(
        screen.getByRole("button", { name: "아디다스 선택" }),
      );
      await userEvent.click(screen.getByRole("button", { name: "주문 확인" }));

      expect(
        await screen.findByText("총 1종류의 상품 1개를 주문합니다."),
      ).toBeInTheDocument();
      expect(screen.getByText("총 결제 금액")).toBeInTheDocument();
      expect(screen.getByText("63,000원")).toBeInTheDocument();
    });
  });
});
