import { AppError } from '../../errors/AppError.js';
import type { Product } from '../products/product.model.js';
import { productRepository } from '../products/product.repository.js';
import { CartItem } from './cartItem.model.js';
import { cartItemRepository } from './cartItem.repository.js';

export const cartItemService = {
  addCartItem(productId: string, purchaseQuantity: number) {
    const product = validateProductId(productId);
    validatePurchaseQuantity(purchaseQuantity);
    validateRemainingQuantity(product, purchaseQuantity);

    const cartItem = new CartItem({
      cartItemId: crypto.randomUUID(),
      productId,
      purchaseQuantity,
    });

    cartItemRepository.save(cartItem);
    return { cartItemId: cartItem.cartItemId };
  },

  getCartItems() {
    return cartItemRepository.findAll();
  },

  getCartItemById(cartItemId: string) {
    return validateCartItemId(cartItemId);
  },

  deleteCartItem(cartItemId: string) {
    const cartItem = validateCartItemId(cartItemId);
    cartItemRepository.deleteById(cartItem.cartItemId);
  },

  changePurchaseQuantity(cartItemId: string, quantity: number) {
    const cartItem = validateCartItemId(cartItemId);
    validatePurchaseQuantity(quantity);

    // 이중 검증
    const product = productRepository.findById(cartItem.productId);
    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');
    }

    validateRemainingQuantity(product, quantity);
    cartItem.purchaseQuantity = quantity;

    return {
      cartItemId: cartItem.cartItemId,
      purchaseQuantity: cartItem.purchaseQuantity,
    };
  },
};

const validateCartItemId = (cartItemId: string) => {
  if (typeof cartItemId !== 'string' || cartItemId.trim() === '') {
    throw new AppError(
      400,
      'INVALID_CART_ITEM_ID',
      '유효하지 않은 장바구니 상품 id입니다.',
    );
  }

  const cartItem = cartItemRepository.findById(cartItemId);

  if (!cartItem) {
    throw new AppError(
      404,
      'CART_ITEM_NOT_FOUND',
      '존재하지 않는 장바구니 상품입니다.',
    );
  }

  return cartItem;
};

const validateProductId = (productId: string) => {
  if (typeof productId !== 'string' || productId.trim() === '') {
    throw new AppError(
      400,
      'INVALID_PRODUCT_ID',
      '유효하지 않은 상품 id입니다.',
    );
  }

  const product = productRepository.findById(productId);

  if (!product) {
    throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');
  }

  return product;
};

const validatePurchaseQuantity = (purchaseQuantity: number) => {
  if (
    typeof purchaseQuantity !== 'number' ||
    !Number.isInteger(purchaseQuantity) ||
    purchaseQuantity < 1 ||
    purchaseQuantity > 99
  ) {
    throw new AppError(
      400,
      'INVALID_PURCHASE_QUANTITY',
      '유효하지 않은 구매 수량입니다.',
    );
  }
};

const validateRemainingQuantity = (
  product: Product,
  purchaseQuantity: number,
) => {
  if (purchaseQuantity > product.remainingQuantity) {
    throw new AppError(
      400,
      'EXCEEDS_REMAINING_QUANTITY',
      '상품의 남은 수량을 초과했습니다.',
    );
  }
};
