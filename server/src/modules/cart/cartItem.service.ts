import { AppError } from '../../errors/AppError.js';
import { ModelError } from '../../errors/ModelError.js';
import type { Product } from '../products/product.model.js';
import { productRepository } from '../products/product.repository.js';
import { CartItem } from './cartItem.model.js';
import { cartItemRepository } from './cartItem.repository.js';

export const cartItemService = {
  addCartItem(productId: string, purchaseQuantity: number) {
    const product = validateProductId(productId);

    // 추가하려는 상품이 장바구니에 이미 존재할 경우
    const foundCartItem = cartItemRepository.findByProductId(productId);
    if (foundCartItem) {
      const nextPurchaseQuantity =
        foundCartItem.purchaseQuantity + purchaseQuantity;

      validateRemainingQuantity(product, nextPurchaseQuantity);
      convertModelError(() =>
        foundCartItem.changeQuantityTo(nextPurchaseQuantity),
      );

      return { cartItemId: foundCartItem.cartItemId, isNew: false };
    }

    // 추가하려는 상품이 장바구니에 존재하지 않는 경우
    validateRemainingQuantity(product, purchaseQuantity);
    const cartItem = convertModelError(
      () =>
        new CartItem({
          cartItemId: crypto.randomUUID(),
          productId,
          purchaseQuantity,
        }),
    );

    cartItemRepository.save(cartItem);
    return { cartItemId: cartItem.cartItemId, isNew: true };
  },

  getCartItems() {
    // CartItem은 productId만 보관하므로, 응답 시점에 상품 정보를 조회해 합친다
    return cartItemRepository.findAll().map((cartItem) => {
      const product = productRepository.findById(cartItem.productId);

      return {
        cartItemId: cartItem.cartItemId,
        productId: cartItem.productId,
        productName: product?.productName,
        productPrice: product?.productPrice,
        imageUrl: product?.imageUrl,
        purchaseQuantity: cartItem.purchaseQuantity,
      };
    });
  },

  getCartItemById(cartItemId: string) {
    return validateCartItemId(cartItemId);
  },

  deleteCartItem(cartItemId: string) {
    const cartItem = validateCartItemId(cartItemId);
    cartItemRepository.deleteById(cartItem.cartItemId);
  },

  deleteByProductId(productId: string) {
    cartItemRepository.deleteByProductId(productId);
  },

  changePurchaseQuantity(cartItemId: string, quantity: number) {
    const cartItem = validateCartItemId(cartItemId);

    // 이중 검증
    const product = productRepository.findById(cartItem.productId);
    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');
    }

    validateRemainingQuantity(product, quantity);
    convertModelError(() => cartItem.changeQuantityTo(quantity));

    return {
      cartItemId: cartItem.cartItemId,
      purchaseQuantity: cartItem.purchaseQuantity,
    };
  },
};

// Model이 던지는 도메인 에러(ModelError)를 HTTP 계층이 이해하는 AppError로 변환한다
const convertModelError = <T>(operation: () => T): T => {
  try {
    return operation();
  } catch (error) {
    if (error instanceof ModelError) {
      throw new AppError(400, error.code, error.message);
    }

    throw error;
  }
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
