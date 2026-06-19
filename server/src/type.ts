export interface ProductIdParams {
  productId: string;
}

export interface CartItemIdParams {
  cartItemId: string;
}

export interface PreorderIdParams {
  preorderId: string;
}

export interface CreateProductRequestBody {
  name: string;
  price: number;
  imageUrl: string;
}

export interface UpdateCartQuantityRequestBody {
  quantity: number;
}

export interface CreatePreorderRequestBody {
  selectedCartIds: string[];
}

export interface PreorderItem {
  productId: string;
  price: number;
  name: string;
  imageUrl: string;
  quantity: number;
}

export interface Preorder {
  preorderId: string;
  items: PreorderItem[];
}

export interface PreviewOrderRequestBody {
  preorderId: string;
  isRemoteArea: boolean;
  couponIds: number[];
}

export interface ExcludedCoupon {
  couponId: number;
  code: string;
  name: string;
  excludedReason: string;
}
