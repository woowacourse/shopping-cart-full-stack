import { RequestHandler } from "express";
import * as cartsService from "./carts.service";
import { validateID, validateQuantity } from "./carts.schema";

export const getCarts: RequestHandler = (_, res) => {
  //cart를 가져온다.
  const carts = cartsService.getCarts();

  res.status(200).json({
    status: "success",
    message: "장바구니를 정상적으로 조회하였습니다.",
    data: carts,
  });
};

export const updateCartQuantity: RequestHandler = (req, res) => {
  const id = +validateID(req.params.id);

  const { quantity } = validateQuantity(req.body);

  const result = cartsService.changeCartQuantity(id, quantity);

  res.status(200).json({
    status: "success",
    message: "장바구니 상품 수량을 정상적으로 변경하였습니다.",
    data: result,
  });
};
