import { RequestHandler } from "express";
import { validateProduct } from "./products.schema";
import * as productsService from "./products.service";

export const getProducts: RequestHandler = (_, res) => {
  // products를 가져오는 서비스 함수를 호출한다.

  const products = productsService.getAllProducts();

  res.status(200).json({
    status: "success",
    message: "상품 목록을 정상적으로 조회하였습니다.",
    data: products,
  });
};

export const addProduct: RequestHandler = (req, res) => {
  try {
    const body = validateProduct(req.body);

    const product = productsService.addProduct(body);

    res.status(201).json({
      status: "success",
      message: "상품을 정상적으로 등록하였습니다.",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message:
        error instanceof Error ? error.message : "상품 등록에 실패하였습니다.",
    });
  }
};
