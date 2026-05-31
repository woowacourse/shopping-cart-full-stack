import { AppError } from '../../errors/AppError.js';
import type {
  CartItemRepository,
  ProductRepository,
} from '../../interfaces/repository.interface.js';
import type { Product } from '../products/product.model.js';
import { CartItem } from './cartItem.model.js';
import { productRepository } from '../products/product.repository.js';
import { cartItemRepository } from './cartItem.repository.js';
import { ModelError } from '../../errors/ModelError.js';
import type { AddCartItemRequest } from './cartItem.request.js';

export const createCartItemService = ({
  productRepository,
  cartItemRepository,
}: {
  productRepository: ProductRepository;
  cartItemRepository: CartItemRepository;
}) => ({
  addCartItem(params: AddCartItemRequest) {
    const { productId, purchaseQuantity } = params;

    const product = findProductOrThrow(productId, productRepository);

    // 담는 수량이 남아있는 수량보다 초과하는지 검증
    validateRemainingQuantity(product, purchaseQuantity);

    // 추가하려는 상품이 장바구니에 이미 존재할 경우
    const foundCartItem = cartItemRepository.findByProductId(productId);
    if (foundCartItem) {
      try {
        const nextPurchaseQuantity =
          foundCartItem.purchaseQuantity + purchaseQuantity;

        validateRemainingQuantity(product, nextPurchaseQuantity);
        foundCartItem.changeQuantityTo(nextPurchaseQuantity);

        return { cartItemId: foundCartItem.cartItemId, isNew: false };
      } catch (error) {
        if (error instanceof ModelError) {
          throw new AppError(400, error.code, error.message);
        }

        throw error;
      }
    }

    // 추가하려는 상품이 장바구니에 존재하지 않는 경우
    try {
      const cartItem = new CartItem({
        cartItemId: crypto.randomUUID(),
        productId,
        purchaseQuantity,
      });

      cartItemRepository.save(cartItem);
      return { cartItemId: cartItem.cartItemId, isNew: true };
    } catch (error) {
      if (error instanceof ModelError) {
        throw new AppError(400, error.code, error.message);
      }

      throw error;
    }
  },

  getCartItems() {
    return cartItemRepository.findAll();
  },

  getCartItemById(cartItemId: string) {
    validateCartItemId(cartItemId);

    return findCartItemOrThrow(cartItemId, cartItemRepository);
  },

  deleteCartItem(cartItemId: string) {
    validateCartItemId(cartItemId);

    const cartItem = findCartItemOrThrow(cartItemId, cartItemRepository);

    cartItemRepository.deleteById(cartItem.cartItemId);
  },

  changePurchaseQuantity(cartItemId: string, quantity: number) {
    validateCartItemId(cartItemId);

    const cartItem = findCartItemOrThrow(cartItemId, cartItemRepository);
    const product = findProductOrThrow(cartItem.productId, productRepository);

    try {
      validateRemainingQuantity(product, quantity);
      cartItem.changeQuantityTo(quantity);

      return {
        cartItemId: cartItem.cartItemId,
        purchaseQuantity: cartItem.purchaseQuantity,
      };
    } catch (error) {
      if (error instanceof ModelError) {
        throw new AppError(400, error.code, error.message);
      }

      throw error;
    }
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

const findCartItemOrThrow = (
  cartItemId: string,
  cartItemRepository: CartItemRepository,
) => {
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
const findProductOrThrow = (
  productId: string,
  productRepository: ProductRepository,
) => {
  const product = productRepository.findById(productId);

  if (!product) {
    throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');
  }

  return product;
};
