export interface IdParams {
  id: string;
}

export interface CreateProductRequestBody {
  name: string;
  price: number;
  imageUrl: string;
}

export interface UpdateCartQuantityRequestBody {
  quantity: number;
}
