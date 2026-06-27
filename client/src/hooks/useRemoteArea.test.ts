import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useRemoteAreaSelection } from "./useRemoteArea";

const IS_REMOTE_AREA_KEY = "isRemoteArea";

describe("useRemoteAreaSelection", () => {
  it("저장된 도서산간 여부를 초기값으로 사용한다.", () => {
    localStorage.setItem(IS_REMOTE_AREA_KEY, "true");

    const { result } = renderHook(() => useRemoteAreaSelection());

    expect(result.current.isRemoteArea).toBe(true);
  });

  it("토글하면 도서산간 여부를 저장한다.", () => {
    const { result } = renderHook(() => useRemoteAreaSelection());

    act(() => {
      result.current.toggleRemoteArea();
    });

    expect(result.current.isRemoteArea).toBe(true);
    expect(localStorage.getItem(IS_REMOTE_AREA_KEY)).toBe("true");
  });
});
