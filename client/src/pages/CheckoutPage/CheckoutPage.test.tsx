import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay as mswDelay, HttpResponse, http } from "msw";
import { createMemoryRouter } from "react-router";
import { createRoutesFromElements, Route, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";
import type { CouponResponseDto } from "../../apis/coupon.api.dto";
import type { OrderSummaryResponseDto } from "../../apis/order.api.dto";
import { server } from "../../test/server";
import OrderCompletePage from "../OrderCompletePage/OrderCompletePage";
import CheckoutPage from "./CheckoutPage";

vi.mock("../../utils/delay", () => ({
  delay: () => Promise.resolve(),
}));

const SELECTED_CART_ITEM_IDS_KEY = "selectedCartItemIds";

const initialOrderSummary: OrderSummaryResponseDto = {
  orderItems: [
    {
      id: 1,
      productId: 10,
      name: "나이키",
      quantity: 1,
      stock: 10,
      imageUrl: "https://example.com/nike.png",
      price: 60000,
    },
  ],
  orderAmount: 60000,
  couponDiscountAmount: 0,
  shippingFee: 3000,
  totalPaymentAmount: 63000,
};

const couponAppliedOrderSummary: OrderSummaryResponseDto = {
  ...initialOrderSummary,
  couponDiscountAmount: 5000,
  totalPaymentAmount: 58000,
};

const remoteAreaOrderSummary: OrderSummaryResponseDto = {
  ...initialOrderSummary,
  shippingFee: 6000,
  totalPaymentAmount: 66000,
};

const initialCouponResponse: CouponResponseDto = {
  bestCombination: [1],
  totalPrice: 60000,
  couponResponses: [
    {
      id: 1,
      name: "5,000원 할인 쿠폰",
      description: ["주문 금액에서 5,000원 할인"],
      discountType: "FIXED",
      isUsable: true,
      discountValue: 5000,
    },
  ],
};

let orderSummary = initialOrderSummary;

function resetOrderSummary(nextSummary = initialOrderSummary) {
  orderSummary = structuredClone(nextSummary);
}

function mockOrderSummary() {
  server.use(
    http.post(/\/orders\/summary$/, () => {
      return HttpResponse.json(orderSummary);
    }),
  );
}

function mockCoupons(response: CouponResponseDto = initialCouponResponse) {
  server.use(
    http.post(/\/coupon$/, () => {
      return HttpResponse.json(response);
    }),
  );
}

function renderCheckoutPage() {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="complete" element={<OrderCompletePage />} />
      </Route>,
    ),
    {
      initialEntries: ["/checkout"],
    },
  );

  return render(<RouterProvider router={router} />);
}

describe("CheckoutPage", () => {
  beforeEach(() => {
    localStorage.setItem(SELECTED_CART_ITEM_IDS_KEY, JSON.stringify([1]));
    resetOrderSummary();
    mockOrderSummary();
    mockCoupons();
  });

  describe("조회", () => {
    it("로딩 중이면 로딩 화면을 보여준다.", async () => {
      server.use(
        http.post(/\/orders\/summary$/, async () => {
          await mswDelay("infinite");
          return HttpResponse.json(initialOrderSummary);
        }),
      );

      renderCheckoutPage();

      expect(
        await screen.findByRole("status", { name: "장바구니 조회 중" }),
      ).toBeInTheDocument();
    });

    it("조회 성공 시 주문 상품과 주문 요약을 보여준다.", async () => {
      renderCheckoutPage();

      expect(
        await screen.findByText("총 1종류의 상품 1개를 주문합니다."),
      ).toBeInTheDocument();
      expect(screen.getByText("나이키")).toBeInTheDocument();
      expect(screen.getByText("배송비")).toBeInTheDocument();
      expect(screen.getByText("총 결제 금액")).toBeInTheDocument();
      expect(screen.getByText("63,000원")).toBeInTheDocument();
    });

    it("조회 실패 시 에러 화면을 보여준다.", async () => {
      server.use(
        http.post(/\/orders\/summary$/, () => {
          return HttpResponse.json(
            {
              code: "ORDER_SUMMARY_ERROR",
              message: "주문 확인 조회에 실패했습니다.",
            },
            { status: 500 },
          );
        }),
      );

      renderCheckoutPage();

      expect(
        await screen.findByText("주문 확인 조회에 실패했습니다."),
      ).toBeInTheDocument();
    });
  });

  describe("쿠폰", () => {
    it("쿠폰 적용 버튼을 누르면 쿠폰 목록을 보여준다.", async () => {
      renderCheckoutPage();

      await screen.findByText("63,000원");

      await userEvent.click(screen.getByRole("button", { name: "쿠폰 적용" }));

      expect(
        await screen.findByText("쿠폰을 선택해 주세요"),
      ).toBeInTheDocument();
      expect(screen.getByText("5,000원 할인 쿠폰")).toBeInTheDocument();
      expect(
        screen.getByText("주문 금액에서 5,000원 할인"),
      ).toBeInTheDocument();
    });

    it("쿠폰을 적용하면 주문 요약을 다시 보여준다.", async () => {
      renderCheckoutPage();

      await screen.findByText("63,000원");
      await userEvent.click(screen.getByRole("button", { name: "쿠폰 적용" }));

      resetOrderSummary(couponAppliedOrderSummary);
      await userEvent.click(
        await screen.findByRole("button", {
          name: "총 5,000원 할인 쿠폰 사용하기",
        }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText("쿠폰을 선택해 주세요"),
        ).not.toBeInTheDocument();
        expect(screen.getByText("58,000원")).toBeInTheDocument();
      });
    });
  });

  describe("배송 정보", () => {
    it("도서산간 지역을 선택하면 주문 요약을 다시 보여준다.", async () => {
      renderCheckoutPage();

      await screen.findByText("63,000원");

      const shippingOption = screen
        .getByText("제주도 및 도서 산간 지역")
        .closest("div");

      if (shippingOption === null) {
        throw new Error("배송 정보 영역을 찾을 수 없습니다.");
      }

      resetOrderSummary(remoteAreaOrderSummary);
      await userEvent.click(within(shippingOption).getByRole("button"));

      expect(await screen.findByText("66,000원")).toBeInTheDocument();
    });
  });

  describe("결제", () => {
    it("결제하기를 누르면 주문 완료 페이지로 이동한다.", async () => {
      renderCheckoutPage();

      await screen.findByText("63,000원");
      await userEvent.click(screen.getByRole("button", { name: "결제하기" }));

      expect(
        await screen.findByText("총 1종류의 상품 1개 주문합니다."),
      ).toBeInTheDocument();
      expect(screen.getByText("63,000원")).toBeInTheDocument();
    });
  });
});
