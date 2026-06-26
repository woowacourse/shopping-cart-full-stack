import { Request, Response } from 'express';
import { RESPONSE_MESSAGE } from '../../constants/responseMessage.js';
import CartAppService from './cart.app-service.js';

export default class CartController {
  constructor(private cartAppService: CartAppService) {}

  getCartItems = (_req: Request, res: Response) => {
    const cartItems = this.cartAppService.getCartItems();

    res.status(200).json({
      message: RESPONSE_MESSAGE.SUCCESS,
      result: { cartItems },
    });
  };

  getCartPayment = (_req: Request, res: Response) => {
    const payment = this.cartAppService.getCartPayment();

    res.status(200).json({
      message: RESPONSE_MESSAGE.SUCCESS,
      result: payment,
    });
  };

  addCartItem = (req: Request, res: Response) => {
    const { orderCount } = req.body;

    const id = this.cartAppService.addCartItem({
      id: Number(req.params.cartItemId),
      orderCount,
    });

    res.status(201).json({
      message: RESPONSE_MESSAGE.CREATED,
      result: { id },
    });
  };

  deleteCartItem = (req: Request, res: Response) => {
    this.cartAppService.deleteCartItem(Number(req.params.cartItemId));

    res.status(204).json();
  };

  updateCartItem = (req: Request, res: Response) => {
    const { orderCount, isSelected } = req.body;

    const updated = this.cartAppService.updateCartItem({
      id: Number(req.params.cartItemId),
      orderCount,
      isSelected,
    });

    res.status(200).json({
      message: RESPONSE_MESSAGE.UPDATED,
      result: updated,
    });
  };
}
