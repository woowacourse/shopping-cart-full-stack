import { RequestHandler } from "express";
import * as cartsService from "./carts.service";

export const getCarts: RequestHandler = (_, res) => {
  //cart를 가져온다.
  const carts = cartsService.getCarts();

  res.status(200).json({
    status: "success",
    message: "장바구니를 정상적으로 조회하였습니다.",
    data: carts,
  });
};
