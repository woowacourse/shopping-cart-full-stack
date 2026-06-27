import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CouponResponse } from "../apis/coupon.api.dto";
import { useCouponSelection } from "./useCouponSelection";

const SELECTED_COUPON_IDS_KEY = "selectedCouponIds";

const coupons: CouponResponse[] = [
  {
    id: 1,
    name: "정액 쿠폰",
    description: ["3,000원 할인"],
    discountType: "FIXED",
    isUsable: true,
    discountValue: 3000,
  },
  {
    id: 2,
    name: "정률 쿠폰",
    description: ["10% 할인"],
    discountType: "RATE",
    isUsable: true,
    discountValue: 10,
  },
  {
    id: 3,
    name: "사용 불가 쿠폰",
    description: ["사용 불가"],
    discountType: "FIXED",
    isUsable: false,
    discountValue: 1000,
  },
];

describe("useCouponSelection", () => {
  it("저장된 쿠폰이 없으면 최고 조합을 선택한다.", () => {
    const { result } = renderHook(() =>
      useCouponSelection(coupons, 10000, [1, 2]),
    );

    expect(result.current.selectedCouponIds).toEqual([1, 2]);
  });

  it("쿠폰은 최대 2개까지만 선택할 수 있다.", () => {
    const { result } = renderHook(() => useCouponSelection(coupons, 10000, []));

    act(() => {
      result.current.toggleCoupon(1);
      result.current.toggleCoupon(2);
      result.current.toggleCoupon(3);
    });

    expect(result.current.selectedCouponIds).toEqual([1, 2]);
  });

  it("완료하면 선택한 쿠폰을 저장한다.", () => {
    const { result } = renderHook(() => useCouponSelection(coupons, 10000, []));

    act(() => {
      result.current.toggleCoupon(1);
    });

    act(() => {
      result.current.completeSelection();
    });

    expect(localStorage.getItem(SELECTED_COUPON_IDS_KEY)).toBe("[1]");
  });
});
