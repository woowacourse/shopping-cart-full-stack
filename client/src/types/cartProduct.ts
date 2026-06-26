export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Cart {
  product: Product;
  quantity: number;
}

export interface QuantityRange {
  min: number;
  max: number;
}
