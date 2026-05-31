import { cartRepository } from "../database/inMemoryDatabase.ts";
import { productRepository } from "../database/inMemoryDatabase.ts";
import type { ProductId, Quantity } from "../types/type.ts";
import Product from "../domain/Product.ts";
import ShoppingCart from "../domain/ShoppingCart.ts";
import { InternalServerError } from "../error.ts";

export function addItemToCart(productId: ProductId, quantity: Quantity) {
  const item = new ShoppingCart(productId, quantity);
  cartRepository.save(item);
}

export function getItemsFromCart(): {
  product: Product;
  quantity: Quantity;
}[] {
  const shoppingCartArray = cartRepository.getShoppingCart();
  return shoppingCartArray.map(({ productId, quantity }) => {
    const product = productRepository.getProduct(productId);

    if (!product) {
      throw new InternalServerError({
        code: "CART_PRODUCT_MISSING",
        message: "장바구니 상품 정보를 불러오지 못했습니다.",
        field: "cart product missing",
      });
    }

    return {
      product: product,
      quantity: quantity,
    };
  });
}

export function updateQuantityOfItem(productId: ProductId, quantity: Quantity) {
  ShoppingCart.validateQuantity(quantity);
  cartRepository.setQuantity(productId, quantity);
}

export function removeItemFromCart(productId: ProductId) {
  cartRepository.removeItem(productId);
}

export function existsInCart(productId: string): boolean {
  return cartRepository.hasProductId(productId);
}
