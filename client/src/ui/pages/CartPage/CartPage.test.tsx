import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { vi, describe, it, expect, afterEach } from "vitest";
import { CartPage } from "./CartPage";
import { server } from "../../../mocks/server";

const mockAlert = vi.fn();
window.alert = mockAlert;

const renderCartPage = () => {
  return render(
    <BrowserRouter>
      <CartPage />
    </BrowserRouter>,
  );
};

describe("장바구니 페이지 통합 테스트", () => {
  afterEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("로딩 스켈레톤 렌더링, 장바구니 목록을 불러온다.", async () => {
    renderCartPage();

    expect(screen.getByText(/로딩/)).toBeInTheDocument();

    expect(await screen.findByText("아메리카노")).toBeInTheDocument();
    expect(screen.getByText("바닐라 라떼")).toBeInTheDocument();
  });

  it("수량을 변경하면 총 결제 금액이 실시간으로 변경된다.", async () => {
    const user = userEvent.setup();
    renderCartPage();

    await screen.findByText("아메리카노");

    // mock 초기 세팅 17,500원
    expect(screen.getByText("17,500원")).toBeInTheDocument();

    const increaseButtons = screen.getAllByRole("button", { name: "+" });
    await user.click(increaseButtons[0]);

    // 아메리카노 1개 추가 시 22,000원
    await waitFor(() => {
      expect(screen.getByText("22,000원")).toBeInTheDocument();
    });
  });

  it("체크박스를 해제하면 결제 금액에서 제외되고, 모두 해제 시 주문 버튼이 비활성화된다.", async () => {
    const user = userEvent.setup();
    renderCartPage();

    await screen.findByText("아메리카노");

    const checkboxes = screen.getAllByRole("checkbox");
    const selectAllCheckbox = checkboxes[0];

    await user.click(selectAllCheckbox);
    const zeroPriceElements = screen.getAllByText("0원");
    expect(zeroPriceElements).toHaveLength(3);

    const orderButton = screen.getByRole("button", { name: "주문 확인" });
    expect(orderButton).toBeDisabled();
  });

  it("삭제 버튼을 클릭하면 장바구니에서 해당 상품이 제거된다.", async () => {
    const user = userEvent.setup();
    renderCartPage();

    await screen.findByText("아메리카노");

    const deleteButtons = screen.getAllByRole("button", { name: "삭제" });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("아메리카노")).not.toBeInTheDocument();
    });
  });

  it("장바구니 아이템 불러오기 실패 시 에러 UI를 렌더링한다.", async () => {
    server.use(
      http.get("http://localhost:3000/cart", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderCartPage();

    expect(await screen.findByText(/못했습니다/)).toBeInTheDocument();
  });

  it("장바구니 아이템 수량 변경 실패 시 에러 경고창을 띄운다.", async () => {
    const user = userEvent.setup();
    server.use(
      http.get("http://localhost:3000/cart", () => {
        return HttpResponse.json([
          { cartItemId: 999, quantity: 1, product: { productId: 999, name: "커피", price: 4000, thumbnailUrl: "https://example.com/test.jpg" } }
        ]);
      }),
      http.patch("http://localhost:3000/cart/:cartItemId", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderCartPage();
    await screen.findByText("커피");

    const increaseButtons = screen.getAllByRole("button", { name: "+" });
    await user.click(increaseButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("수량 변경에 실패했습니다.");
    });
  });

  it("장바구니 아이템 제거 실패 시 에러 경고창을 띄운다.", async () => {
    const user = userEvent.setup();
    server.use(
      http.get("http://localhost:3000/cart", () => {
        return HttpResponse.json([
          { cartItemId: 999, quantity: 1, product: { productId: 999, name: "커피", price: 4000, thumbnailUrl: "https://example.com/test.jpg" } }
        ]);
      }),
      http.delete("http://localhost:3000/cart/:cartItemId", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderCartPage();
    await screen.findByText("커피");

    const deleteButtons = screen.getAllByRole("button", { name: "삭제" });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("상품 제거에 실패했습니다.");
    });
  });

  it("수량 한계치 도달 시 조절 버튼이 비활성화된다.", async () => {
    server.use(
      http.get("http://localhost:3000/cart", () => {
        return HttpResponse.json([
          { cartItemId: 1, quantity: 1, product: { productId: 1, name: "바닐라 라떼", price: 5000, thumbnailUrl: "https://example.com/test.jpg" } },
          { cartItemId: 2, quantity: 99, product: { productId: 2, name: "아메리카노", price: 4000, thumbnailUrl: "https://example.com/test.jpg" } },
        ]);
      })
    );

    renderCartPage();
    await screen.findByText("바닐라 라떼");

    const minusButtons = screen.getAllByRole("button", { name: "−" });
    const plusButtons = screen.getAllByRole("button", { name: "+" });

    expect(minusButtons[0]).toBeDisabled();
    expect(plusButtons[1]).toBeDisabled();
  });

  it("총 주문 금액이 100,000원 이상일 경우 배송비가 0원", async () => {
    server.use(
      http.get("http://localhost:3000/cart", () => {
        return HttpResponse.json([
          {
            cartItemId: 1,
            quantity: 1,
            product: {
              productId: 1,
              name: "커피 머신",
              price: 100000,
              thumbnailUrl: "https://example.com/test.jpg",
            },
          },
        ]);
      })
    );

    renderCartPage();

    await screen.findByText("커피 머신");

    const priceElements = screen.getAllByText("100,000원");
    expect(priceElements).toHaveLength(3);

    expect(screen.getByText("0원")).toBeInTheDocument();
  });

  it("장바구니가 비어있을 때, 빈 상태 UI를 렌더링한다.", async () => {
    server.use(
      http.get("http://localhost:3000/cart", () => {
        return HttpResponse.json([]);
      })
    );

    renderCartPage();

    expect(
      await screen.findByText("장바구니에 담은 상품이 없습니다.")
    ).toBeInTheDocument();

    const orderButton = screen.getByRole("button", { name: "주문 확인" });
    expect(orderButton).toBeDisabled();
  });
});
