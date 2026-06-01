export interface ProductIdParams {
  productId: string;
}

export interface CartItemIdParams {
  cartItemId: string;
}

export interface CreateProductRequestBody {
  name: string;
  price: number;
  imageUrl: string;
}

export interface UpdateCartQuantityRequestBody {
  quantity: number;
}
