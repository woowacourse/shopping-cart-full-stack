import { AppError } from '../../errors/AppError.js';
import { ModelError } from '../../errors/ModelError.js';
import type { Product } from '../products/product.model.js';
import {
  productRepository,
  type ProductRepository,
} from '../products/product.repository.js';
import { CartItem } from './cartItem.model.js';
import {
  cartItemRepository,
  type CartItemRepository,
} from './cartItem.repository.js';

export class CartItemService {
  constructor(
    private readonly cartItemRepository: CartItemRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  addCartItem(productId: string, purchaseQuantity: number) {
    const product = this.validateProductId(productId);

    // 추가하려는 상품이 장바구니에 이미 존재할 경우
    const foundCartItem = this.cartItemRepository.findByProductId(productId);
    if (foundCartItem) {
      const nextPurchaseQuantity =
        foundCartItem.purchaseQuantity + purchaseQuantity;

      this.validateRemainingQuantity(product, nextPurchaseQuantity);
      this.convertModelError(() =>
        foundCartItem.changeQuantityTo(nextPurchaseQuantity),
      );

      return { cartItemId: foundCartItem.cartItemId, isNew: false };
    }

    // 추가하려는 상품이 장바구니에 존재하지 않는 경우
    this.validateRemainingQuantity(product, purchaseQuantity);
    const cartItem = this.convertModelError(
      () =>
        new CartItem({
          cartItemId: crypto.randomUUID(),
          productId,
          purchaseQuantity,
        }),
    );

    this.cartItemRepository.save(cartItem);
    return { cartItemId: cartItem.cartItemId, isNew: true };
  }

  getCartItems() {
    // CartItem은 productId만 보관하므로, 응답 시점에 상품 정보를 조회해 합친다
    return this.cartItemRepository.findAll().map((cartItem) => {
      const product = this.productRepository.findById(cartItem.productId);

      return {
        cartItemId: cartItem.cartItemId,
        productId: cartItem.productId,
        productName: product?.productName,
        productPrice: product?.productPrice,
        imageUrl: product?.imageUrl,
        purchaseQuantity: cartItem.purchaseQuantity,
      };
    });
  }

  getCartItemById(cartItemId: string) {
    return this.validateCartItemId(cartItemId);
  }

  deleteCartItem(cartItemId: string) {
    const cartItem = this.validateCartItemId(cartItemId);
    this.cartItemRepository.deleteById(cartItem.cartItemId);
  }

  deleteByProductId(productId: string) {
    this.cartItemRepository.deleteByProductId(productId);
  }

  changePurchaseQuantity(cartItemId: string, quantity: number) {
    const cartItem = this.validateCartItemId(cartItemId);

    // 이중 검증
    const product = this.productRepository.findById(cartItem.productId);
    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');
    }

    this.validateRemainingQuantity(product, quantity);
    this.convertModelError(() => cartItem.changeQuantityTo(quantity));

    return {
      cartItemId: cartItem.cartItemId,
      purchaseQuantity: cartItem.purchaseQuantity,
    };
  }

  private validateCartItemId(cartItemId: string) {
    if (typeof cartItemId !== 'string' || cartItemId.trim() === '') {
      throw new AppError(
        400,
        'INVALID_CART_ITEM_ID',
        '유효하지 않은 장바구니 상품 id입니다.',
      );
    }

    const cartItem = this.cartItemRepository.findById(cartItemId);

    if (!cartItem) {
      throw new AppError(
        404,
        'CART_ITEM_NOT_FOUND',
        '존재하지 않는 장바구니 상품입니다.',
      );
    }

    return cartItem;
  }

  private validateProductId(productId: string) {
    if (typeof productId !== 'string' || productId.trim() === '') {
      throw new AppError(
        400,
        'INVALID_PRODUCT_ID',
        '유효하지 않은 상품 id입니다.',
      );
    }

    const product = this.productRepository.findById(productId);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');
    }

    return product;
  }

  private validateRemainingQuantity(product: Product, purchaseQuantity: number) {
    if (purchaseQuantity > product.remainingQuantity) {
      throw new AppError(
        400,
        'EXCEEDS_REMAINING_QUANTITY',
        '상품의 남은 수량을 초과했습니다.',
      );
    }
  }

  // Model이 던지는 도메인 에러(ModelError)를 HTTP 계층이 이해하는 AppError로 변환한다
  private convertModelError<T>(operation: () => T): T {
    try {
      return operation();
    } catch (error) {
      if (error instanceof ModelError) {
        throw new AppError(400, error.code, error.message);
      }

      throw error;
    }
  }
}

// 조립: 기본 인스턴스를 만들어 export (routes는 이 인스턴스를 그대로 사용)
export const cartItemService = new CartItemService(
  cartItemRepository,
  productRepository,
);
