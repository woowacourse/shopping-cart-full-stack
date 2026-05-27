import { Request, Response } from "express";
import { cartRepository } from "../repositories/CartRepository";
import { productRepository } from "../repositories/ProductRepository";

const getCartItems = (_request: Request, response: Response): Response => {
  const cartItems = cartRepository.getCartProducts();
  return response.status(200).json(cartItems);
};

const postCartItem = (request: Request, response: Response): Response => {
  try {
    const { productId, quantity } = request.body;
    const product = productRepository.findById(Number(productId));

    if (!product) {
      return response
        .status(404)
        .json({ message: "해당 상품이 존재하지 않습니다." });
    }
    const addedCartItem = cartRepository.addProductToCart(Number(productId), Number(quantity));
    return response.status(201).json(addedCartItem);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({ message: "잘못된 요청 형식입니다." });
    }
    return response
      .status(500)
      .json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

const deleteCartItem = (request: Request, response: Response): Response => {
  try {
    const cartItemId = Number(request.params.cartItemId);
    if (!cartItemId) {
      return response
        .status(400)
        .json({ message: "유효하지 않은 장바구니 ID입니다." });
    }

    const cartItem = cartRepository.findById(cartItemId);
    if (!cartItem) {
      return response
        .status(404)
        .json({ message: "해당 장바구니 상품이 존재하지 않습니다." });
    }

    cartRepository.deleteByCartId(cartItemId);

    return response.status(204).send();
  } catch (error) {
    return response
      .status(500)
      .json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

const patchCartItem = (request: Request, response: Response): Response => {
  try {
    const cartItemId = Number(request.params.cartItemId);
    if (!cartItemId) {
      return response
        .status(400)
        .json({ message: "유효하지 않은 장바구니 ID입니다." });
    }

    const newQuantity = Number(request.body.quantity);
    if (!newQuantity) {
      return response
        .status(400)
        .json({ message: "유효하지 않은 수량입니다." });
    }

    const patchedCartItem = cartRepository.changeQuantity(
      cartItemId,
      newQuantity,
    );
    if (!patchedCartItem) {
      return response
        .status(404)
        .json({ message: "해당 장바구니 상품이 존재하지 않습니다." });
    }

    return response.status(200).json(patchedCartItem);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({ message: "잘못된 요청 형식입니다." });
    }
    return response
      .status(500)
      .json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

export default { getCartItems, postCartItem, deleteCartItem, patchCartItem };
