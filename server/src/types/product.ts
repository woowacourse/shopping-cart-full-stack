export interface ProductIdParams {
  productId: string;
}

export interface CreateProductRequestBody {
  name: string;
  price: number;
  imageUrl: string;
}
