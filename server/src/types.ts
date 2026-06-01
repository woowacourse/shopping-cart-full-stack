export interface Product {
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export interface CartItem extends Pick<Product, 'productId'> {
  cartItemId: string;
  quantity: number;
}
