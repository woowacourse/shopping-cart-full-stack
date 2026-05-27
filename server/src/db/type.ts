export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
}

export interface Cart {
  carts: Product["id"][];
}
