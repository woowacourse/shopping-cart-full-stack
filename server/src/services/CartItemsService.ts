import ProductsRepository from '../repositories/ProductsRepository';
import CartItemsRepository from '../repositories/CartItemsRepository';
import { CartItem } from '../types';
import { BadRequestError, NotFoundError } from '../errors';

class CartItemsService {
  productsRepository;
  cartRepository;

  constructor() {
    this.productsRepository = new ProductsRepository();
    this.cartRepository = new CartItemsRepository();
  }

  async getCartItems() {
    const products = await this.productsRepository.getAll();
    const cartItems = await this.cartRepository.getAll();

    return cartItems.map((item) => ({
      cartItemId: item.cartItemId,
      quantity: item.quantity,
      product: products.find((product) => product.productId === item.productId),
    }));
  }

  async insertCartItem(cartItem: {
    productId: CartItem['productId'];
    quantity: CartItem['quantity'];
  }) {
    if (cartItem.productId.length < 1)
      throw new BadRequestError({ productId: '상품ID는 1자 이상이어야 합니다.' });

    if (cartItem.quantity < 1 || cartItem.quantity > 99 || !Number.isInteger(cartItem.quantity))
      throw new BadRequestError({ quantity: '수량은 1 이상 99 이하의 정수여야 합니다.' });

    const product = await this.productsRepository.getById(cartItem.productId);

    if (!product) throw new NotFoundError({ productId: '존재하지 않는 상품입니다.' });

    const cartItems = await this.cartRepository.getAll();

    if (cartItems.find((item) => item.productId === product.productId)) {
      throw new BadRequestError({ productId: '이미 장바구니에 담긴 상품입니다.' });
    }

    const inserted = await this.cartRepository.insertByUser(cartItem);

    return {
      cartItemId: inserted.cartItemId,
      quantity: inserted.quantity,
      product,
    };
  }

  async patchCartItem(
    cartItemId: CartItem['cartItemId'],
    cartItemPartial: { quantity: CartItem['quantity'] },
  ) {
    if (
      cartItemPartial.quantity < 1 ||
      cartItemPartial.quantity > 99 ||
      !Number.isInteger(cartItemPartial.quantity)
    )
      throw new BadRequestError({ quantity: '수량은 1 이상 99 이하의 정수여야 합니다.' });

    const cartItem = await this.cartRepository.getById(cartItemId);

    if (!cartItem) throw new NotFoundError({ cartItemId: '존재하지 않는 장바구니 항목입니다.' });

    const product = await this.productsRepository.getById(cartItem.productId);

    if (!product) throw new NotFoundError({ productId: '존재하지 않는 상품입니다.' });

    const newCartItem = {
      ...cartItem,
      quantity: cartItemPartial.quantity,
    };

    await this.cartRepository.updateById(cartItemId, newCartItem);

    return {
      cartItemId: newCartItem.cartItemId,
      quantity: newCartItem.quantity,
      product,
    };
  }

  async deleteCartItem(cartItemId: CartItem['cartItemId']) {
    const cartItem = await this.cartRepository.getById(cartItemId);

    if (!cartItem) throw new NotFoundError({ cartItemId: '존재하지 않는 장바구니 항목입니다.' });

    const deleted = await this.cartRepository.deleteById(cartItemId);

    if (!deleted) throw new NotFoundError({ cartItemId: '존재하지 않는 장바구니 항목입니다.' });

    return deleted;
  }
}

export default CartItemsService;
