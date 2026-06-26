import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeAll } from "vitest";
import CouponSelectModal from "../components/CouponSelectModal";
import { Coupon } from "../types";
import * as api from "../api";

vi.mock("../api", () => ({
  calculateCouponDiscountPrice: vi.fn(),
}));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

const mockCoupons: Coupon[] = [
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
];

describe("CouponSelectModal", () => {
  test("모달이 열렸을 때 쿠폰 목록이 렌더링된다", () => {
    render(
      <CouponSelectModal
        orderId="order-1"
        coupons={mockCoupons}
        maxCouponCount={2}
        selectedCoupons={[]}
        initialDiscountPrice={0}
        updateOrder={vi.fn()}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("10% 할인 쿠폰")).toBeInTheDocument();
    expect(screen.getByText("3,000원 할인 쿠폰")).toBeInTheDocument();
    expect(screen.getByText("만료일: 2026-12-31")).toBeInTheDocument();
    expect(screen.getByText("만료일: 2026-06-30")).toBeInTheDocument();
    expect(screen.getByText("전 상품 10% 할인")).toBeInTheDocument();
    expect(
      screen.getByText("5만원 이상 구매 시 사용 가능"),
    ).toBeInTheDocument();
  });

  test("쿠폰 개수만큼 체크박스가 렌더링된다", () => {
    render(
      <CouponSelectModal
        orderId="order-1"
        coupons={mockCoupons}
        maxCouponCount={2}
        selectedCoupons={[]}
        initialDiscountPrice={0}
        updateOrder={vi.fn()}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    expect(checkboxes).toHaveLength(mockCoupons.length);
  });

  test("쿠폰이 없으면 쿠폰 아이템이 렌더링되지 않는다", () => {
    render(
      <CouponSelectModal
        orderId="order-1"
        coupons={[]}
        maxCouponCount={2}
        selectedCoupons={[]}
        initialDiscountPrice={0}
        updateOrder={vi.fn()}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    const checkboxes = screen.queryAllByRole("checkbox", { hidden: true });
    expect(checkboxes).toHaveLength(0);
  });

  test("is_active에 따라 쿠폰에 투명도가 적용된다.", () => {
    render(
      <CouponSelectModal
        orderId="order-1"
        coupons={mockCoupons}
        maxCouponCount={2}
        selectedCoupons={[]}
        initialDiscountPrice={0}
        updateOrder={vi.fn()}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    const couponItems = screen.getAllByRole("listitem", { hidden: true });
    expect(couponItems[0]).toHaveStyle("opacity: 1");
    expect(couponItems[1]).toHaveStyle("opacity: 0.3");
  });

  test("버튼에 초기 할인 금액이 표시된다", () => {
    render(
      <CouponSelectModal
        orderId="order-1"
        coupons={mockCoupons}
        maxCouponCount={2}
        selectedCoupons={[]}
        initialDiscountPrice={5000}
        updateOrder={vi.fn()}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByText("총 5,000원 할인 쿠폰 사용하기"),
    ).toBeInTheDocument();
  });

  test("쿠폰을 클릭하면 버튼의 가격이 변경된다", async () => {
    const user = userEvent.setup();
    vi.mocked(api.calculateCouponDiscountPrice).mockResolvedValue({
      discount_price: 10000,
    });

    render(
      <CouponSelectModal
        orderId="order-1"
        coupons={mockCoupons}
        maxCouponCount={2}
        selectedCoupons={[]}
        initialDiscountPrice={5000}
        updateOrder={vi.fn()}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    const checkbox = screen.getAllByRole("checkbox", { hidden: true })[0];
    await user.click(checkbox);

    await waitFor(() => {
      expect(
        screen.getByText("총 10,000원 할인 쿠폰 사용하기"),
      ).toBeInTheDocument();
    });
  });

  test("쿠폰은 3개 이상 선택하면 선택되지 않는다", async () => {
    const user = userEvent.setup();
    vi.mocked(api.calculateCouponDiscountPrice).mockRejectedValue(
      new Error("쿠폰은 최대 2개까지 선택할 수 있습니다."),
    );

    render(
      <CouponSelectModal
        orderId="order-1"
        coupons={mockCoupons}
        maxCouponCount={2}
        selectedCoupons={["coupon-1", "coupon-2"]}
        initialDiscountPrice={5000}
        updateOrder={vi.fn()}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    await user.click(checkboxes[2]);

    await waitFor(() => {
      expect(checkboxes[2]).not.toBeChecked();
    });
  });

  test("선택된 쿠폰을 다시 클릭하면 버튼의 가격이 변경된다", async () => {
    const user = userEvent.setup();
    vi.mocked(api.calculateCouponDiscountPrice).mockResolvedValue({
      discount_price: 0,
    });

    render(
      <CouponSelectModal
        orderId="order-1"
        coupons={mockCoupons}
        maxCouponCount={2}
        selectedCoupons={["coupon-1"]}
        initialDiscountPrice={5000}
        updateOrder={vi.fn()}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    const checkbox = screen.getAllByRole("checkbox", { hidden: true })[0];
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText("총 0원 할인 쿠폰 사용하기")).toBeInTheDocument();
    });
  });
});
