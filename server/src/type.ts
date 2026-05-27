export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
}

export type CartId = Product["id"];
