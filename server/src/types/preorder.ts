export interface PreorderIdParams {
  preorderId: string;
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
