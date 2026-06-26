import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, test } from "vitest";
import OrderConfirmPage from "../../pages/OrderCompletePage/OrderCompletePage";

const renderOrderConfirmPage = () => {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/cart/order-confirm",
          state: {
            productCount: 2,
            productItemCount: 3,
            totalPrice: 203000,
          },
        },
      ]}
    >
      <Routes>
        <Route path="/cart/order-confirm" element={<OrderConfirmPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("OrderConfirmPage", () => {
  test("상품 종류수, 총 주문 수량, 최종 결제금액이 표시된다", () => {
    renderOrderConfirmPage();

    expect(
      screen.getByText("총 2종류의 상품", { exact: false }),
    ).toHaveTextContent("총 2종류의 상품 3개를 주문합니다.");
    expect(screen.getByText("총 결제 금액").nextSibling).toHaveTextContent(
      "203,000원",
    );
  });

  test("결제하기 버튼이 비활성화 된다", () => {
    renderOrderConfirmPage();

    expect(screen.getByRole("button", { name: "결제하기" })).toBeDisabled();
  });
});
