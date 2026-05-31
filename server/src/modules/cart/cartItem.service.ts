import { AppError } from '../../errors/AppError.js';
import {
  CartItemRepository,
  ProductRepository,
} from '../../interfaces/repository.interface.js';
import type { Product } from '../products/product.model.js';
import { CartItem } from './cartItem.model.js';
import { productRepository } from '../products/product.repository.js';
import { cartItemRepository } from './cartItem.repository.js';

export const createCartItemService = ({
  productRepository,
  cartItemRepository,
}: {
  productRepository: ProductRepository;
  cartItemRepository: CartItemRepository;
}) => ({
  addCartItem(productId: string, purchaseQuantity: number) {
    const product = validateProductId(productId);
    validatePurchaseQuantity(purchaseQuantity);
    validateRemainingQuantity(product, purchaseQuantity);

    // 추가하려는 상품이 장바구니에 이미 존재할 경우
    const foundCartItem = cartItemRepository.findByProductId(productId);
    if (foundCartItem) {
      const nextPurchaseQuantity =
        foundCartItem.purchaseQuantity + purchaseQuantity;

      validatePurchaseQuantity(nextPurchaseQuantity);
      validateRemainingQuantity(product, nextPurchaseQuantity);
      foundCartItem.changeQuantityTo(nextPurchaseQuantity);

      return { cartItemId: foundCartItem.cartItemId, isNew: false };
    }

    // 추가하려는 상품이 장바구니에 존재하지 않는 경우
    const cartItem = new CartItem({
      cartItemId: crypto.randomUUID(),
      productId,
      purchaseQuantity,
    });

    cartItemRepository.save(cartItem);
    return { cartItemId: cartItem.cartItemId, isNew: true };
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
    cartItem.changeQuantityTo(quantity);

    return {
      cartItemId: cartItem.cartItemId,
      purchaseQuantity: cartItem.purchaseQuantity,
    };
  },
});

export const cartItemService = createCartItemService({
  productRepository,
  cartItemRepository,
});

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
