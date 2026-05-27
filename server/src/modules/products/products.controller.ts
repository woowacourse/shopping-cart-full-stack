import { RequestHandler } from "express";
import { getAllProducts } from "./products.service";

export const getProducts: RequestHandler = (_, res) => {
  // products를 가져오는 서비스 함수를 호출한다.

  const products = getAllProducts();

  res.status(200).json({
    status: "success",
    message: "상품 목록을 정상적으로 조회하였습니다.",
    data: products,
  });
};
