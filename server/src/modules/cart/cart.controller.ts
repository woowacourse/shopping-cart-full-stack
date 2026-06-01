import { NextFunction, Request, Response } from "express";
import CartService from "./cart.service.js";

class CartController {
  constructor(private cartService: CartService) {}

  addCartItem = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, itemCount } = req.body;
      this.cartService.addCartItem(productId, itemCount);

      res.status(201).json({
        message: "성공적으로 생성되었습니다.",
        result: { productId },
      });
    } catch (error) {
      next(error);
    }
  };

  getCartItems = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const cartItems = this.cartService.getCartItems();

      res.status(200).json({
        code: 200,
        message: "요청에 성공했습니다.",
        result: { cartItems },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCartItem = (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;

      this.cartService.deleteCartItem(Number(productId));

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  updateItemCount = (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.id);
      const { itemCount } = req.body;

      this.cartService.updateItemCount(productId, itemCount);

      res.status(200).json({
        code: 200,
        message: "성공적으로 수량이 변경되었습니다.",
        result: {
          id: productId,
          itemCount: itemCount,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default CartController;
