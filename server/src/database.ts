export interface Product {
  id?: number;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DB {
  Products: Product[];
  Cart: Product[];
}

export const DB: DB = {
  Products: [],
  Cart: [],
};
