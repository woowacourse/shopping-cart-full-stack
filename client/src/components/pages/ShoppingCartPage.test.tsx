import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { http, HttpResponse, delay } from "msw";
import { server } from "../../../mocks/server";
import ShoppingCartPage from "./ShoppingCartPage";
import { mockCartItems, resetCartItems } from "../../../mocks/handlers";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<ShoppingCartPage />} />
        <Route path="/order-confirm" element={<div>주문 확인 페이지</div>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  resetCartItems();
  localStorage.clear();
});

describe("ShoppingCartPage", () => {
  describe("데이터 로딩", () => {
    it("API 요청 중에는 스켈레톤 UI를 표시한다", async () => {
      server.use(
        http.get("/cart", async () => {
          await delay("infinite");
          return HttpResponse.json([]);
        }),
      );
      renderPage();
      expect(screen.getByTestId("card-list-skeleton")).toBeInTheDocument();
    });

    it("API 에러 시 에러 메시지를 표시한다", async () => {
      server.use(
        http.get("/cart", () => HttpResponse.json({}, { status: 500 })),
      );
      renderPage();
      await screen.findByText("장바구니를 불러오는 데 실패했습니다.");
    });

    it("상품 목록을 렌더링한다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      expect(screen.getByText("상품 B")).toBeInTheDocument();
    });
  });

  describe("전체선택", () => {
    it("초기 진입 시 전체선택 체크박스가 체크된 상태다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      expect(screen.getByRole("checkbox", { name: "전체선택" })).toBeChecked();
    });

    it("전체선택 클릭 시 모든 상품이 해제된다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      await userEvent.click(screen.getByRole("checkbox", { name: "전체선택" }));
      const [, ...itemCheckboxes] = screen.getAllByRole("checkbox");
      itemCheckboxes.forEach((cb) => expect(cb).not.toBeChecked());
    });

    it("전체 해제 상태에서 전체선택 클릭 시 모두 선택된다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      const allCheckbox = screen.getByRole("checkbox", { name: "전체선택" });
      await userEvent.click(allCheckbox);
      await userEvent.click(allCheckbox);
      const [, ...itemCheckboxes] = screen.getAllByRole("checkbox");
      itemCheckboxes.forEach((cb) => expect(cb).toBeChecked());
    });
  });

  describe("개별 선택", () => {
    it("개별 상품 체크박스 클릭 시 해당 상품만 해제된다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      const [, first, second] = screen.getAllByRole("checkbox");
      await userEvent.click(first);
      expect(first).not.toBeChecked();
      expect(second).toBeChecked();
    });

    it("개별 상품 해제 시 전체선택 체크박스도 해제된다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      const [allCheckbox, first] = screen.getAllByRole("checkbox");
      await userEvent.click(first);
      expect(allCheckbox).not.toBeChecked();
    });
  });

  describe("수량 변경", () => {
    it("+ 버튼 클릭 시 수량이 1 증가한다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      await userEvent.click(screen.getAllByRole("button", { name: "+" })[0]);
      expect(screen.getAllByRole("spinbutton")[0]).toHaveValue(2);
    });

    it("- 버튼 클릭 시 수량이 1 감소한다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      await userEvent.click(screen.getAllByRole("button", { name: "+" })[0]);
      await userEvent.click(screen.getAllByRole("button", { name: "-" })[0]);
      expect(screen.getAllByRole("spinbutton")[0]).toHaveValue(1);
    });

    it("수량이 1일 때 - 버튼을 클릭해도 1 미만으로 내려가지 않는다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      await userEvent.click(screen.getAllByRole("button", { name: "-" })[0]);
      expect(screen.getAllByRole("spinbutton")[0]).toHaveValue(1);
    });

    it("수량이 99일 때 + 버튼을 클릭해도 99 초과로 올라가지 않는다", async () => {
      server.use(
        http.get("/cart", () =>
          HttpResponse.json([{ ...mockCartItems[0], quantity: 99 }]),
        ),
      );
      renderPage();
      await screen.findByText("상품 A");
      await userEvent.click(screen.getAllByRole("button", { name: "+" })[0]);
      expect(screen.getAllByRole("spinbutton")[0]).toHaveValue(99);
    });
  });

  describe("결제 금액 계산", () => {
    it("선택된 상품의 금액만 합산한다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      const [, first] = screen.getAllByRole("checkbox");
      await userEvent.click(first); // 상품 A(35,000) 해제 → 총 결제 73,000
      await waitFor(() =>
        expect(screen.getByText("73,000원")).toBeInTheDocument(),
      );
    });

    it("주문 금액 10만원 이상 시 배송비가 0원이다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      // 35,000 + 70,000 = 105,000 → 무료배송
      await waitFor(() => expect(screen.getByText("0원")).toBeInTheDocument());
    });

    it("주문 금액 10만원 미만 시 배송비가 추가된다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      const [, first] = screen.getAllByRole("checkbox");
      await userEvent.click(first); // 상품 B(70,000)만 → 배송비 3,000
      await waitFor(() =>
        expect(screen.getByText("3,000원")).toBeInTheDocument(),
      );
    });
  });

  describe("주문 확인 버튼", () => {
    it("장바구니가 비어있을 때 버튼이 비활성화된다", async () => {
      server.use(http.get("/cart", () => HttpResponse.json([])));
      renderPage();
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: "주문 확인" }),
        ).toBeDisabled(),
      );
    });

    it("선택된 상품이 없을 때 버튼이 비활성화된다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      await userEvent.click(screen.getByRole("checkbox", { name: "전체선택" }));
      expect(screen.getByRole("button", { name: "주문 확인" })).toBeDisabled();
    });

    it("클릭 시 /order-confirm으로 이동한다", async () => {
      renderPage();
      await screen.findByText("상품 A");
      await userEvent.click(screen.getByRole("button", { name: "주문 확인" }));
      expect(screen.getByText("주문 확인 페이지")).toBeInTheDocument();
    });
  });

  describe("localStorage", () => {
    it("새로고침 후에도 선택 상태가 유지된다", async () => {
      const { unmount } = renderPage();
      await screen.findByText("상품 A");
      const [, first] = screen.getAllByRole("checkbox");
      await userEvent.click(first);
      unmount();

      renderPage();
      await screen.findByText("상품 A");
      const [, firstAfter] = screen.getAllByRole("checkbox");
      expect(firstAfter).not.toBeChecked();
    });
  });
});
