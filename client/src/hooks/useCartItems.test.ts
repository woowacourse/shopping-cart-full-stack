import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CartItemsResponseDto } from "../apis/cart.api.dto";
import useCartItems from "./useCartItems";

const SELECTED_CART_ITEM_IDS_KEY = "selectedCartItemIds";

const cartItems: CartItemsResponseDto = [
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

describe("useCartItems", () => {
  it("로컬스토리지가 없으면 모든 상품을 선택 상태로 초기화한다.", () => {
    localStorage.removeItem(SELECTED_CART_ITEM_IDS_KEY);

    const deleteItem = vi
      .fn<() => Promise<void>>()
      .mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useCartItems({
        cartItemsList: cartItems,
        deleteItem,
      }),
    );

    expect(result.current.items.every((item) => item.isSelected)).toBe(true);
  });

  it("로컬스토리지 없을 때 초기 로드 시 전체 선택 상태를 로컬스토리지에 저장한다.", async () => {
    localStorage.removeItem(SELECTED_CART_ITEM_IDS_KEY);

    const deleteItem = vi
      .fn<() => Promise<void>>()
      .mockResolvedValue(undefined);
    renderHook(() =>
      useCartItems({
        cartItemsList: cartItems,
        deleteItem,
      }),
    );

    await waitFor(() => {
      expect(localStorage.getItem(SELECTED_CART_ITEM_IDS_KEY)).toBe(
        JSON.stringify([1, 2]),
      );
    });
  });

  it("로컬스토리지에 빈 배열이 있으면 모든 상품이 선택 해제된 상태로 초기화한다.", () => {
    localStorage.setItem(SELECTED_CART_ITEM_IDS_KEY, "[]");

    const deleteItem = vi
      .fn<() => Promise<void>>()
      .mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useCartItems({
        cartItemsList: cartItems,
        deleteItem,
      }),
    );

    expect(result.current.items.every((item) => !item.isSelected)).toBe(true);
  });

  it("삭제 성공 시 선택된 상품 id에서 삭제된 상품 id를 제거한다.", async () => {
    localStorage.setItem(SELECTED_CART_ITEM_IDS_KEY, JSON.stringify([1, 2]));
    const deleteItem = vi
      .fn<() => Promise<void>>()
      .mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCartItems({
        cartItemsList: cartItems,
        deleteItem,
      }),
    );

    await act(async () => {
      await result.current.actions.handleDeleteItem(1);
    });

    expect(localStorage.getItem(SELECTED_CART_ITEM_IDS_KEY)).toBe("[2]");
  });
});
