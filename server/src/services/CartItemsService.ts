import ProductsRepository from '../repositories/ProductsRepository';
import CartItemsRepository from '../repositories/CartItemsRepository';
import { CartItem } from '../types';
import { NotFoundError } from '../errors';

class CartItemsService {
  productsRepository;
  cartRepository;

  constructor() {
    this.productsRepository = new ProductsRepository();
    this.cartRepository = new CartItemsRepository();
  }

  async getCartItems() {
    const cartItems = await this.cartRepository.getAllByUser();

    return cartItems;
  }

  async insertCartItem(cartItem: {
    productId: CartItem['productId'];
    quantity: CartItem['quantity'];
  }) {
    const product = await this.productsRepository.getById(cartItem.productId);
    if (!product) throw new NotFoundError('장바구니에 담을 상품');
    const cartItemObj = {
      ...product,
      quantity: cartItem.quantity,
    };
    return await this.cartRepository.insertByUser(cartItemObj);
  }

  async patchCartItem(
    cartItemId: CartItem['cartItemId'],
    cartItemPartial: { quantity: CartItem['quantity'] },
  ) {
    // 카트 아이템을 가져온다, 없으면 에러를 낸다
    // 카드 아이템 수량을 수정한다
    const cartItem = await this.cartRepository.getById(cartItemId);
    if (!cartItem) throw new NotFoundError('장바구니 항목');
    const newCartItem = {
      ...cartItem,
      quantity: cartItemPartial.quantity,
    };
    return await this.cartRepository.updateById(cartItemId, newCartItem);
  }

  async deleteCartItem(cartItemId: CartItem['cartItemId']) {
    const cartItem = await this.cartRepository.getById(cartItemId);
    // TODO: 상품 삭제시 해당 상품을 담아놓은 장바구니에서 제거해줘야함
    if (!cartItem) throw new NotFoundError('삭제할 장바구니 상품');
    return await this.cartRepository.deleteById(cartItemId);
  }
}

export default CartItemsService;
