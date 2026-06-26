import AppError from "../../errors/AppError.js";
import CartItem from "./CartItem.js";
import { ProductRepository } from "../product/product.repository.js";
import { CartRepository } from "./cart.repository.js";

class CartService {
  constructor(
    private cartRepository: CartRepository,
    private productRepository: ProductRepository,
  ) {}

  addCart() {
    const newCart = this.cartRepository.create();

    return newCart.toJson().id;
  }

  getCartItems(cartId: number) {
    const cart = this.getCart(cartId);

    return cart.toJsonCartItems().map((cartItem) => {
      const product = this.productRepository.findById(cartItem.productId);

      if (!product) {
        throw new AppError("PRODUCT_NOT_EXIST");
      }

      const productData = product.toJson();

      return {
        productId: productData.id,
        name: productData.name,
        price: productData.price,
        imgUrl: productData.imgUrl,
        itemCount: cartItem.itemCount,
      };
    });
  }

  addCartItem(cartId: number, productId: number, itemCount: number) {
    const cart = this.getCart(cartId);
    const nextItemCount = cart.getItemCount(productId) + itemCount;

    CartItem.validateItemCount(itemCount);
    this.validateProductStock(productId, nextItemCount);

    cart.addCartItem(productId, itemCount);

    return productId;
  }

  deleteCartItem(cartId: number, productId: number) {
    const cart = this.getCart(cartId);

    cart.deleteCartItem(productId);
  }

  updateItemCount(cartId: number, productId: number, itemCount: number) {
    const cart = this.getCart(cartId);

    CartItem.validateItemCount(itemCount);
    this.validateProductStock(productId, itemCount);

    cart.updateCartItemCount(productId, itemCount);

    return {
      productId,
      itemCount,
    };
  }

  private getCart(cartId: number) {
    const cart = this.cartRepository.findById(cartId);

    if (!cart) {
      throw new AppError("CART_NOT_EXIST");
    }

    return cart;
  }

  private validateProductStock(productId: number, itemCount: number) {
    const product = this.productRepository.findById(productId);

    if (!product) {
      throw new AppError("PRODUCT_NOT_EXIST");
    }

    if (!product.hasEnoughStock(itemCount)) {
      throw new AppError("PRODUCT_ORDER_COUNT_EXCEEDED");
    }
  }
}

export default CartService;
