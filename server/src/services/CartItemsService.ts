import ProductsRepository from '../repositories/ProductsRepository';
import CartItemsRepository from '../repositories/CartItemsRepository';
import { CartItem } from '../types';
import { BadRequestError, NotFoundError } from '../errors';
import { CartItemSchema } from '../schemas';

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
      ...item,
      product: products.find((product) => product.productId === item.productId),
    }));
  }

  async insertCartItem(cartItem: {
    productId: CartItem['productId'];
    quantity: CartItem['quantity'];
  }) {
    const parsedCartItem = CartItemSchema.parse(cartItem);

    const product = await this.productsRepository.getById(parsedCartItem.productId);

    if (!product) throw new NotFoundError({ productId: '존재하지 않는 상품입니다.' });

    const cartItems = await this.cartRepository.getAll();

    if (cartItems.find((item) => item.productId === product.productId)) {
      throw new BadRequestError({ productId: '이미 장바구니에 담긴 상품입니다.' });
    }

    const inserted = await this.cartRepository.insertByUser(parsedCartItem);

    return {
      ...inserted,
      product,
    };
  }

  async patchCartItem(
    cartItemId: CartItem['cartItemId'],
    cartItemPartial: { quantity: CartItem['quantity'] },
  ) {
    const parsedCartItemPartial = CartItemSchema.pick({ quantity: true }).parse(cartItemPartial);

    const cartItem = await this.cartRepository.getById(cartItemId);

    if (!cartItem) throw new NotFoundError({ cartItemId: '존재하지 않는 장바구니 항목입니다.' });

    const product = await this.productsRepository.getById(cartItem.productId);

    if (!product) throw new NotFoundError({ productId: '존재하지 않는 상품입니다.' });

    const newCartItem = {
      ...cartItem,
      quantity: parsedCartItemPartial.quantity,
    };

    await this.cartRepository.updateById(cartItemId, newCartItem);

    return {
      ...newCartItem,
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
