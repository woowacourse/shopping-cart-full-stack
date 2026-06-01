import { CartItemData } from "../CartItem";

export interface CartRepositoryInterface {
  findById(cartItemId: number): CartItemData | null;
  getCartProducts(): CartItemData[];
  addProductToCart(productId: number, quantity: number): CartItemData;
  changeQuantity(cartItemId: number, newQuantity: number): CartItemData | null;
  deleteByCartId(cartItemId: number): void;
  deleteByProductId(productId: number): void;
}
