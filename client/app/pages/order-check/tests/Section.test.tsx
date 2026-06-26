import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeAll } from "vitest";
import { MemoryRouter } from "react-router";
import Section from "../components/Section";
import { Coupon } from "../types";
import * as api from "../api";

vi.mock("../api", () => ({
  getOrder: vi.fn(),
  getCoupons: vi.fn(),
  calculateCouponDiscountPrice: vi.fn(),
  updateOrder: vi.fn(),
}));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

const mockCoupons: { max_coupon_count: number; items: Coupon[] } = {
  max_coupon_count: 2,
  items: [
    {
      id: "coupon-1",
      name: "10% 할인 쿠폰",
      expiration_date: "2026-12-31",
      description: "전 상품 10% 할인",
      is_active: true,
    },
    {
      id: "coupon-2",
      name: "3,000원 할인 쿠폰",
      expiration_date: "2026-06-30",
      description: "5만원 이상 구매 시 사용 가능",
      is_active: false,
    },
    {
      id: "coupon-3",
      name: "2+1 쿠폰",
      expiration_date: "2026-11-30",
      description: "2개 구매 시 1개 무료",
      is_active: true,
    },
  ],
};

const initialOrder = {
  id: "order-1",
  hard_delivery_place: false,
  selected_coupons: [],
  selected_items: [
    {
      product_id: "p-1",
      quantity: 2,
      product: { name: "상품1", thumbnail: "", price: 25000 },
    },
  ],
  price_summary: {
    order_price: 50000,
    discount_price: 0,
    delivery_price: 3000,
    total_price: 53000,
  },
};

const updatedOrder = {
  ...initialOrder,
  selected_coupons: ["coupon-1"],
  price_summary: {
    order_price: 50000,
    discount_price: 10000,
    delivery_price: 3000,
    total_price: 43000,
  },
};

describe("제주도 및 도서 산간 지역 체크박스", () => {
  test("체크박스 클릭할 때마다 배송비가 변경된다", async () => {
    const user = userEvent.setup();

    const orderWithNormalDelivery = {
      ...initialOrder,
      hard_delivery_place: false,
      price_summary: {
        order_price: 50000,
        discount_price: 0,
        delivery_price: 3000,
        total_price: 53000,
      },
    };

    const orderWithHardDelivery = {
      ...initialOrder,
      hard_delivery_place: true,
      price_summary: {
        order_price: 50000,
        discount_price: 0,
        delivery_price: 6000,
        total_price: 56000,
      },
    };

    vi.mocked(api.getOrder).mockResolvedValue(orderWithNormalDelivery);
    vi.mocked(api.updateOrder)
      .mockResolvedValueOnce(orderWithHardDelivery)
      .mockResolvedValueOnce(orderWithNormalDelivery);

    render(
      <MemoryRouter>
        <Section orderId="order-1" />
      </MemoryRouter>,
    );

    await waitFor(() => screen.getByText("제주도 및 도서 산간 지역"));

    expect(screen.getByText("3,000원")).toBeInTheDocument();

    const checkbox = screen.getByLabelText("제주도 및 도서 산간 지역");
    await user.click(checkbox);

    await waitFor(() => {
      expect(api.updateOrder).toHaveBeenCalledWith("order-1", {
        hard_delivery_place: true,
      });
      expect(screen.getByText("6,000원")).toBeInTheDocument();
    });

    await user.click(checkbox);

    await waitFor(() => {
      expect(api.updateOrder).toHaveBeenCalledWith("order-1", {
        hard_delivery_place: false,
      });
      expect(screen.getByText("3,000원")).toBeInTheDocument();
    });
  });
});

describe("Section + CouponSelectModal 통합", () => {
  test("쿠폰 사용하기 버튼 클릭 시 Section의 가격이 변경된다", async () => {
    const user = userEvent.setup();

    vi.mocked(api.getOrder).mockResolvedValue(initialOrder);
    vi.mocked(api.getCoupons).mockResolvedValue(mockCoupons);
    vi.mocked(api.calculateCouponDiscountPrice).mockResolvedValue({
      discount_price: 10000,
    });
    vi.mocked(api.updateOrder).mockResolvedValue(updatedOrder);

    render(
      <MemoryRouter>
        <Section orderId="order-1" />
      </MemoryRouter>,
    );

    await waitFor(() => screen.getByText("쿠폰 적용"));

    await user.click(screen.getByText("쿠폰 적용"));

    await waitFor(() => screen.getByText("10% 할인 쿠폰"));

    const checkbox = screen.getAllByRole("checkbox", { hidden: true })[0];
    await user.click(checkbox);

    await waitFor(() => screen.getByText("총 10,000원 할인 쿠폰 사용하기"));

    await user.click(screen.getByText("총 10,000원 할인 쿠폰 사용하기"));

    await waitFor(() => {
      expect(screen.getByText("10,000원")).toBeInTheDocument();
      expect(screen.getByText("43,000원")).toBeInTheDocument();
    });
  });
});
