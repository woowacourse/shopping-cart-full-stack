import { shoppingCart } from '../database/inMemoryDatabase.ts';
import { products } from '../database/inMemoryDatabase.ts';
import type { ProductId, Quantity } from '../types/type.ts';
import Product from '../domain/Product.ts';

export function createShoppingCart(productId: ProductId, quantity: Quantity) {
  shoppingCart.add({ productId, quantity });
}

export function getShoppingCart(): {
  product: Product | undefined;
  quantity: Quantity;
  isSelected: boolean;
}[] {
  const shoppingCartArray = shoppingCart.getShoppingCart();
  return shoppingCartArray.map(({ productId, quantity, isSelected }) => {
    return {
      product: products.get(productId),
      quantity,
      isSelected: !!isSelected,
    };
  });
}

export function patchShoppingCart(productId: ProductId, quantity: Quantity) {
  shoppingCart.setQuantity(productId, quantity);
}

export function getShoppingCartAmountSummary() {
  const orderAmount = getShoppingCart()
    .filter(({ product, isSelected }) => product && isSelected)
    .reduce((total, { product, quantity }) => {
      return total + product!.getProduct().price * quantity;
    }, 0);
  const shippingFee = orderAmount >= 100000 || orderAmount === 0 ? 0 : 3000;
  const totalAmount = orderAmount + shippingFee;

  return {
    amount: {
      orderAmount,
      shippingFee,
      totalAmount,
    },
  };
}

export function patchShoppingCartSelection(
  productId: ProductId,
  isSelected: boolean,
) {
  shoppingCart.setSelection(productId, isSelected);
}

export function patchAllShoppingCartSelection(isSelected: boolean) {
  shoppingCart.setAllSelection(isSelected);
}

export function patchShoppingCartItem(
  productId: ProductId,
  {
    quantity,
    isSelected,
  }: {
    quantity?: Quantity;
    isSelected?: boolean;
  },
) {
  if (quantity !== undefined) {
    shoppingCart.setQuantity(productId, quantity);
  }

  if (isSelected !== undefined) {
    shoppingCart.setSelection(productId, isSelected);
  }
}

export function deleteShoppingCart(productId: ProductId) {
  shoppingCart.deleteProduct(productId);
}

export function hasShoppingCartProduct(productId: ProductId): boolean {
  return shoppingCart.hasProductId(productId);
}
