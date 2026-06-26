import { RequestHandler } from "express";
import { validateID, validateQuantity } from "../schema/carts.schema";
import { CartsService } from "../service/carts.service";

export class CartsController {
  constructor(private cartsService: CartsService) {}

  getCarts: RequestHandler = (_, res) => {
    const carts = this.cartsService.getCarts();

    res.status(200).json({
      status: "success",
      message: "장바구니를 정상적으로 조회하였습니다.",
      data: carts,
    });
  };

  updateCartQuantity: RequestHandler = (req, res) => {
    const id = validateID(req.params.id);

    const { quantity } = validateQuantity(req.body);

    const result = this.cartsService.changeCartQuantity(id, quantity);

    res.status(200).json({
      status: "success",
      message: "장바구니 상품 수량을 정상적으로 변경하였습니다.",
      data: result,
    });
  };

  deleteCartProduct: RequestHandler = (req, res) => {
    const id = validateID(req.params.id);

    const result = this.cartsService.deleteCartsProduct(id);

    res.status(200).json({
      status: "success",
      message: "장바구니에서 상품을 정상적으로 제거하였습니다.",
      data: { id: result },
    });
  };
}
