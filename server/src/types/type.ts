export type ProductData = {
  name: string;
  price: number;
  image?: string | null;
  productId: string;
};

export type ProductId = string;
export type Quantity = number;

export type ShoppingCartData = {
  productId: ProductId;
  quantity: Quantity;
};
