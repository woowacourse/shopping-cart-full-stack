import AppError from "../../errors/AppError.js";
import { ProductRepository } from "../product/product.repository.js";
import { CartRepository } from "./cart.repository.js";

class CartService {
  constructor(
    private cartRepository: CartRepository,
    private productRepository: ProductRepository,
  ) {}

  getCartItems() {
    const cartItems = this.cartRepository.get();

    return cartItems.map((cartItem) => {
      const product = this.productRepository.findById(
        cartItem.toJson().productId,
      );
      if (!product) {
        throw new AppError("PRODUCT_NOT_EXIST");
      }
      const productData = product.toJson();

      return {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        imgUrl: productData.imgUrl,
        itemCount: cartItem.toJson().itemCount,
      };
    });
  }

  addCartItem(productId: number, itemCount: number) {
    this.cartRepository.add(productId, itemCount);

    return productId;
  }

  deleteCartItem(id: number) {
    const targetCartItem = this.cartRepository.findByProductId(id);
    if (!targetCartItem) {
      throw new AppError("PRODUCT_NOT_EXIST_IN_CART");
    }
    this.cartRepository.delete(id);
  }

  updateItemCount(productId: number, itemCount: number) {
    const cartItem = this.cartRepository.findByProductId(productId);

    if (!cartItem) {
      throw new AppError("PRODUCT_NOT_EXIST_IN_CART");
    }

    const product = this.productRepository.findById(
      cartItem.toJson().productId,
    );

    if (!product) {
      throw new AppError("PRODUCT_NOT_EXIST");
    }

    if (!product.hasEnoughStock(itemCount)) {
      throw new AppError("PRODUCT_ORDER_COUNT_EXCEEDED");
    }

    cartItem.updateItemCount(itemCount);

    return {
      productId,
      itemCount,
    };
  }

  reset() {
    this.cartRepository.reset();
  }
}

export default CartService;
