import { Request, Response } from "express";
import { cartRepository } from "../repositories/CartRepository";
import { productRepository } from "../repositories/ProductRepository";

const getCartItems = (_request: Request, response: Response): Response => {
  const cartItems = cartRepository.getCartProducts();
  return response.status(200).json(cartItems);
};

const runPostCartItem = (request: Request, response: Response): void => {
  const { productId, quantity } = request.body;
  const product = productRepository.findById(Number(productId));

  if (!product) {
    response.status(404).json({ message: "해당 상품이 존재하지 않습니다." });
  }

  const addedCartItem = cartRepository.addProductToCart(
    Number(productId),
    Number(quantity),
  ); //이거 분리
  response.status(201).json(addedCartItem);
};

const runDeleteCartItem = (request: Request, response: Response): void => {
  const cartItemId = Number(request.params.cartItemId);
  if (!cartItemId) {
    response.status(400).json({ message: "유효하지 않은 장바구니 ID입니다." });
  }

  const cartItem = cartRepository.findById(cartItemId); //이거 분리
  if (!cartItem) {
    response
      .status(404)
      .json({ message: "해당 장바구니 상품이 존재하지 않습니다." });
  }

  cartRepository.deleteByCartId(cartItemId);

  response.status(204).send();
};

const runPatchCartItem = (request: Request, response: Response): void => {
  const cartItemId = Number(request.params.cartItemId);
  if (!cartItemId) {
    response.status(400).json({ message: "유효하지 않은 장바구니 ID입니다." });
  }

  const newQuantity = Number(request.body.quantity);
  if (!newQuantity) {
    response.status(400).json({ message: "유효하지 않은 수량입니다." });
  }

  const patchedCartItem = cartRepository.changeQuantity(
    cartItemId,
    newQuantity,
  ); //이거 분리

  if (!patchedCartItem) {
    response
      .status(404)
      .json({ message: "해당 장바구니 상품이 존재하지 않습니다." });
  }

  response.status(200).json(patchedCartItem);
};

const postCartItem = (request: Request, response: Response): void => {
  try {
    runPostCartItem(request, response);
  } catch (error) {
    handleError(response, error);
    //   if (error instanceof Error) {
    //     return response.status(400).json({ message: "잘못된 요청 형식입니다." });
    //   }
    //   return response
    //     .status(500)
    //     .json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

const deleteCartItem = (request: Request, response: Response): void => {
  try {
    runDeleteCartItem(request, response);
  } catch (error) {
    handleError(response, error);
    response.status(500).json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

const patchCartItem = (request: Request, response: Response): void => {
  try {
    runPatchCartItem(request, response);
  } catch (error) {
    handleError(response, error);
    // if (error instanceof Error) {
    //   response.status(400).json({ message: "잘못된 요청 형식입니다." });
    // }
    // response
    //   .status(500)
    //   .json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

export default { getCartItems, postCartItem, deleteCartItem, patchCartItem };
