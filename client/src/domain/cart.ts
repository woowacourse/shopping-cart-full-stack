export const MIN_PURCHASE_QUANTITY = 1;
export const MAX_PURCHASE_QUANTITY = 99;

export const CART_ITEM_STATUS = {
  AVAILABLE: "available",
  OUT_OF_STOCK: "outOfStock",
  QUANTITY_EXCEEDED: "quantityExceeded",
} as const;

export type CartItemStatus = (typeof CART_ITEM_STATUS)[keyof typeof CART_ITEM_STATUS];

export interface CartItem {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
  status: CartItemStatus;
}

const LOW_STOCK_THRESHOLD = 3;

export function getCartItemStatusMessage(status: CartItemStatus, stock: number, quantity: number): string | undefined {
  switch (status) {
    case CART_ITEM_STATUS.OUT_OF_STOCK:
      return "품절된 상품입니다.";
    case CART_ITEM_STATUS.QUANTITY_EXCEEDED:
      return `최대 구매 가능 수량이 ${Math.min(stock, MAX_PURCHASE_QUANTITY)}개 입니다.`;
    case CART_ITEM_STATUS.AVAILABLE:
      if (stock - quantity <= LOW_STOCK_THRESHOLD) {
        return `재고가 얼마 남지 않았습니다. (구매 가능 수량 ${stock}개)`;
      }
      return undefined;
  }
}
