import { CartItem } from './../types';

const cartItems = new Map<string, CartItem>();

class CartItemsRepository {
  store;

  constructor() {
    this.store = cartItems;
  }

  async getAllByUser() {
    return Array.from(this.store.entries()).map((entry) => entry[1]);
  }

  async insertByUser(cartItem: Omit<CartItem, 'cartItemId' | 'isDeleted'>) {
    const cartItemObj = {
      isDeleted: false,
      cartItemId: this.store.size.toString(),
      ...cartItem,
    };
    this.store.set(cartItemObj.cartItemId, cartItemObj);
    return cartItemObj;
  }
}

export default CartItemsRepository;
