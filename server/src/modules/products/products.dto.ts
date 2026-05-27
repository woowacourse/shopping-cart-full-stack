export interface ProductResponse {
  id: string;
  price: number;
  name: string;
  imgUrl: string;
}

export interface ProductRequest {
  price: number;
  name: string;
  imgUrl: string;
}
