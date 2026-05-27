export interface CartItemData {
    cartItemId: number;
    productId: number;
    quantity: number;
}

export const validateCartItemData = (quantity: number): void => {
  if (quantity < 1 || quantity > 99) {
    throw new Error("quantity는 1~99 사이어야합니다.");
  }
};
