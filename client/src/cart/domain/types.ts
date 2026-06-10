export type CartStatus = 'loading' | 'success' | 'error';

export type ProductId = string;

export type CartItemId = string;

export type ProductInfo = {
  id: ProductId;
  name: string;
  price: number;
  imageUrl: string;
};

export type CartItem = {
  id: CartItemId;
  productInfo: ProductInfo;
  quantity: number;
};

export type CartItemsState = {
  status: CartStatus;
  items: CartItem[];
  errorMessage: string;
};

export type CartSelectionState = {
  selectedIds: CartItemId[];
};
