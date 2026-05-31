import { Request, Response } from "express";
import type CartService from "./cart.service.js";
import { BadRequestError } from "../../errors/http-error.js";

export interface CartResponse {
  productId: number;
  productName: string;
  productImg: string;
  productPrice: number;
  quantity: number;
}

export default class CartController {
  constructor(private cartService: CartService) {}

  getAllItems = async (req: Request, res: Response) => {
    const dbItems = await this.cartService.getAll();
    const cartItems: CartResponse[] = dbItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImg: item.product.imgUrl,
      productPrice: item.product.price,
      quantity: item.quantity,
    }));

    res.status(200).json({
      result: "success",
      data: {
        cartItems,
      },
    });
  };

  updateQuantity = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const id = Number(productId);

    if (Number.isNaN(id) || Number.isNaN(Number(quantity)) || quantity < 1 || quantity > 99) {
      throw new BadRequestError("수량이 유효하지 않습니다.");
    }

    const data = await this.cartService.updateQuantity(id, quantity);
    res.status(200).json({
      result: "success",
      data,
    });
  };

  deleteItem = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const id = Number(productId);

    if (Number.isNaN(id)) {
      res.status(204).json();
      return;
    }

    await this.cartService.delete(id);
    res.status(204).json();
  };
}
