import { Request, Response } from "express";
import CartService from "../domain/cart/cart.service.js";
import { errorHandler } from "../errors/errorHandler.js";

class CartController {
  constructor(private cartService: CartService) {}

  addCartItem = (req: Request, res: Response) => {
    try {
      const { productId, itemCount } = req.body;
      this.cartService.addCartItem(productId, itemCount);

      res.status(201).json({
        message: "성공적으로 생성되었습니다.",
        result: { productId },
      });
    } catch (error) {
      const { status, code, message } = errorHandler(error);
      res.status(status).json({ code, message });
    }
  };

  getCartItems = (_req: Request, res: Response) => {
    try {
      const cartItems = this.cartService.getCartItems();

      res.status(200).json({
        code: 200,
        message: "요청에 성공했습니다.",
        result: { cartItems },
      });
    } catch (error) {
      const { status, code, message } = errorHandler(error);
      res.status(status).json({ code, message });
    }
  };

  deleteCartItem = (req: Request, res: Response) => {
    try {
      const productId = req.params.id;

      this.cartService.deleteCartItem(Number(productId));

      res.status(204).json();
    } catch (error) {
      const { status, code, message } = errorHandler(error);
      res.status(status).json({ code, message });
    }
  };

  updateItemCount = (req: Request, res: Response) => {
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
      const { status, code, message } = errorHandler(error);
      res.status(status).json({ code, message });
    }
  };
}

export default CartController;
