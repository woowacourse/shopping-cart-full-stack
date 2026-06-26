import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { http, HttpResponse } from "msw";
import CheckOrder from "./CheckOrder";
import { server } from "../../test/mocks/server";
import { BASE_URL } from "../../test/mocks/handlers";
import type { ShoppingCartItem } from "../shoppingCart/types";

const selectedItems: ShoppingCartItem[] = [
  {
    product: { id: "1", image: "/a.png", name: "테스트 상품 A", price: 60000 },
    quantity: 2,
  },
];

const renderCheckOrder = () =>
  render(
    <MemoryRouter
      initialEntries={[{ pathname: "/checkorder", state: { selectedItems } }]}
    >
      <Routes>
        <Route path="/checkorder" element={<CheckOrder />} />
        <Route path="/payment" element={<div>결제 확인 페이지</div>} />
      </Routes>
    </MemoryRouter>,
  );

const getSummaryValue = (label: string) => {
  const heading = screen.getByRole("heading", { name: label });
  return heading.parentElement?.querySelector("span")?.textContent ?? "";
};

describe("CheckOrder", () => {
  it("선택한 상품과 서버가 계산한 결제 금액을 표시한다", async () => {
    renderCheckOrder();

    expect(screen.getByText("테스트 상품 A")).toBeInTheDocument();
    expect(
      screen.getByText("총 1종류의 상품 2개를 주문합니다."),
    ).toBeInTheDocument();

    await waitFor(() => expect(getSummaryValue("주문 금액")).toBe("120,000원"));
    expect(getSummaryValue("배송비")).toBe("0원");
    expect(getSummaryValue("총 결제 금액")).toBe("120,000원");
  });

  it("쿠폰을 선택해 적용하면 할인 금액이 결제 금액에 반영된다", async () => {
    const user = userEvent.setup();
    renderCheckOrder();

    await user.click(screen.getByRole("button", { name: "쿠폰 적용" }));

    expect(await screen.findByText("쿠폰을 선택해 주세요")).toBeInTheDocument();

    await user.click(await screen.findByLabelText("5,000원 할인 쿠폰"));
    await user.click(screen.getByRole("button", { name: /쿠폰 사용하기/ }));

    await waitFor(() =>
      expect(getSummaryValue("쿠폰 할인 금액")).toBe("-5,000원"),
    );
    expect(getSummaryValue("총 결제 금액")).toBe("115,000원");
  });

  it("도서산간 지역을 선택하면 배송비가 추가된다", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/checkorder",
            state: {
              selectedItems: [
                {
                  product: {
                    id: "1",
                    image: "/a.png",
                    name: "저가 상품",
                    price: 10000,
                  },
                  quantity: 1,
                },
              ],
            },
          },
        ]}
      >
        <CheckOrder />
      </MemoryRouter>,
    );

    await waitFor(() => expect(getSummaryValue("배송비")).toBe("3,000원"));
    expect(getSummaryValue("총 결제 금액")).toBe("13,000원");

    await user.click(screen.getByLabelText("제주도 및 도서산간 지역"));

    await waitFor(() => expect(getSummaryValue("배송비")).toBe("6,000원"));
    expect(getSummaryValue("총 결제 금액")).toBe("16,000원");
  });

  it("결제 검증이 실패하면 결제 확인 페이지로 이동하지 않고 서버 오류 메시지를 보여준다", async () => {
    server.use(
      http.post(`${BASE_URL}/coupons/validation`, () =>
        HttpResponse.json(
          { message: "만료된 쿠폰이 존재합니다." },
          { status: 400 },
        ),
      ),
    );

    const user = userEvent.setup();
    renderCheckOrder();

    // 계산이 끝나 결제 버튼이 활성화될 때까지 기다린다.
    await waitFor(() =>
      expect(getSummaryValue("총 결제 금액")).toBe("120,000원"),
    );

    await user.click(screen.getByRole("button", { name: "결제하기" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "만료된 쿠폰이 존재합니다.",
    );
    expect(screen.queryByText("결제 확인 페이지")).not.toBeInTheDocument();
  });
});
