import { RequestHandler } from "express";
import { validateProduct } from "./products.schema";
import * as productsService from "./products.service";
import ERROR_CODES from "./products.constants";

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
    const errorMessage = error instanceof Error ? error.message : "";
    const statusCode =
      ERROR_CODES[errorMessage as keyof typeof ERROR_CODES]?.status || 400;
    const message =
      ERROR_CODES[errorMessage as keyof typeof ERROR_CODES]?.message ||
      "상품 등록에 실패하였습니다.";

    res.status(statusCode).json({
      status: "error",
      message: message,
    });
  }
};
