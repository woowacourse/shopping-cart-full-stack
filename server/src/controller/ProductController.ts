import { Request, Response } from "express";
import { productRepository } from "../repositories/ProductRepository";
import { cartRepository } from "../repositories/CartRepository";

const getProducts = (_request: Request, response: Response): Response => {
  const products = productRepository.getProducts();
  return response.status(200).json(products);
};

const postProducts = (request: Request, response: Response): Response => {
  try {
    const addedProduct = productRepository.addProduct(request.body);

    return response.status(201).json(addedProduct);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({ message: "잘못된 요청 형식입니다." });
    }
    return response
      .status(500)
      .json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

const deleteProducts = (request: Request, response: Response): Response => {
  try {
    const productId = Number(request.params.productId);
    if (!productId) {
      return response
        .status(400)
        .json({ message: "유효하지 않은 상품 ID입니다." });
    }

    const product = productRepository.findById(productId);
    if (!product) {
      return response
        .status(404)
        .json({ message: "해당 상품이 존재하지 않습니다." });
    }

    productRepository.deleteById(productId);
    cartRepository.deleteByProductId(productId);
    
    return response.status(204).send();
  } catch (error) {
    return response
      .status(500)
      .json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

export default { getProducts, postProducts, deleteProducts };
