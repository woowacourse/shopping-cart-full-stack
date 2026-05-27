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

    return cartItems.filter((item) => item.isDeleted === false);
  }

  async insertCartItem(cartItem: {
    productId: CartItem['productId'];
    quantity: CartItem['quantity'];
  }) {
    const product = await this.productsRepository.getById(cartItem.productId);
    if(!product) throw new NotFoundError("장바구니에 담을 상품");
    const cartItemObj = {
      ...product,
      quantity: cartItem.quantity
    }
    return await this.cartRepository.insertByUser(cartItemObj);
  }
}

export default CartItemsService;
