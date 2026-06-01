import { NextFunction, Request, Response } from "express";
import CartService from "./cart.service.js";

class CartController {
  constructor(private cartService: CartService) {}

  addCart = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.cartService.addCart();

      res.status(201).json({
        message: "성공적으로 생성되었습니다.",
        result: { id },
      });
    } catch (error) {
      next(error);
    }
  };

  addCartItem = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId } = req.params;
      const { productId, itemCount } = req.body;
      this.cartService.addCartItem(Number(cartId), productId, itemCount);

      res.status(201).json({
        message: "성공적으로 생성되었습니다.",
        result: { productId },
      });
    } catch (error) {
      next(error);
    }
  };

  getCartItems = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId } = req.params;
      const cartItems = this.cartService.getCartItems(Number(cartId));

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
      const { cartId, productId } = req.params;

      this.cartService.deleteCartItem(Number(cartId), Number(productId));

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  updateItemCount = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartId, productId } = req.params;
      const { itemCount } = req.body;

      this.cartService.updateItemCount(
        Number(cartId),
        Number(productId),
        itemCount,
      );

      res.status(200).json({
        code: 200,
        message: "성공적으로 수량이 변경되었습니다.",
        result: {
          id: Number(productId),
          itemCount: itemCount,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default CartController;
