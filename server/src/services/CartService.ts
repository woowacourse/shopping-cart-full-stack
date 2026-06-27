import { InvalidInputError, NotFoundError } from "../errors/HttpError.js";
import type { CartItem } from "../models/CartItem.js";
import type { CartItemRepository } from "../repositories/CartItemRepository.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";
import type { UpdateCartQuantityRequestBody } from "../type.js";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

const isValidQuantity = (quantity: unknown) => {
  return (
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= MIN_QUANTITY &&
    quantity <= MAX_QUANTITY
  );
};

const isUpdateCartQuantityRequestBody = (
  body: unknown,
): body is UpdateCartQuantityRequestBody => {
  return typeof body === "object" && body !== null;
};

const isValidUpdateCartQuantityBody = (
  body: unknown,
): body is UpdateCartQuantityRequestBody => {
  if (!isUpdateCartQuantityRequestBody(body)) {
    return false;
  }

  return isValidQuantity(body.quantity);
};

export interface CartServiceDeps {
  cartItemRepository: CartItemRepository;
  productRepository: ProductRepository;
}

export const createCartService = ({
  cartItemRepository,
  productRepository,
}: CartServiceDeps) => {
  const toCartItemResponse = async (cartItem: CartItem) => {
    const product = await productRepository.findById(cartItem.productId);

    if (!product) {
      throw new NotFoundError();
    }

    return {
      id: cartItem.id,
      product,
      quantity: cartItem.getQuantity(),
    };
  };

  return {
    async getCartItems() {
      const items = await cartItemRepository.findAll();
      return Promise.all(items.map(toCartItemResponse));
    },

    async updateQuantity(id: string, body: unknown) {
      if (!isValidUpdateCartQuantityBody(body)) {
        throw new InvalidInputError();
      }

      const updatedCartItem = await cartItemRepository.updateQuantity(
        id,
        body.quantity,
      );

      if (!updatedCartItem) {
        throw new NotFoundError();
      }

      return toCartItemResponse(updatedCartItem);
    },

    async deleteCartItem(id: string): Promise<void> {
      const isDeleted = await cartItemRepository.deleteById(id);

      if (!isDeleted) {
        throw new NotFoundError();
      }
    },
  };
};

export type CartService = ReturnType<typeof createCartService>;
