import { Request, Response } from 'express';
import CartItemsService from '../services/CartItemsService';
import {
  InsertCartItemBodySchema,
  UpdateCartItemRequestParamsSchema,
  UpdateCartItemRequestBodySchema,
  DeleteCartItemRequestParamsSchema,
} from '../schemas';
import { ZodError } from 'zod';
import { NotFoundError } from '../errors';

class CartItemContorller {
  service;

  constructor() {
    this.service = new CartItemsService();
  }

  getCartItems = async (_req: Request, res: Response) => {
    try {
      const cartItems = await this.service.getCartItems();
      res.status(200).json({
        status: 'success',
        data: cartItems,
      });
    } catch {
      res.status(500).json({
        status: 'error',
        data: '장바구니 목록을 가져오는 중 에러가 발생했습니다.',
      });
    }
  };

  postCartItems = async (req: Request, res: Response) => {
    try {
      const parsedBody = InsertCartItemBodySchema.parse(req.body);

      const cartItem = await this.service.insertCartItem(parsedBody);
      res.status(201).json({
        status: 'success',
        data: cartItem,
      });
    } catch (error: unknown) {
      // TODO: zod 에러 잡기
      if (error instanceof ZodError) {
        const { fieldErrors } = error.flatten();

        res.status(400).json({
          status: 'fail',
          data: fieldErrors,
        });
      }
      res.status(500).json({
        status: 'error',
        data: '상품을 추가하는 중 에러가 발생했습니다.',
      });
    }
  };

  patchCartItems = async (req: Request, res: Response) => {
    try {
      // 카트 아이템 아이디, 카드 아이템(수량) 받기
      const parsedParams = UpdateCartItemRequestParamsSchema.parse(req.params);

      const parsedBody = UpdateCartItemRequestBodySchema.parse(req.body);

      const cartItems = await this.service.patchCartItem(parsedParams.cartItemId, parsedBody);

      res.status(200).json({
        status: 'success',
        data: cartItems,
      });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const { fieldErrors } = error.flatten();

        res.status(400).json({
          status: 'fail',
          data: fieldErrors,
        });
      }

      if (error instanceof NotFoundError) {
        res.status(404).json({
          status: 'fail',
          data: { [error.resource]: error.message },
        });
      }

      res.status(500).json({
        status: 'error',
        data: '장바구니 목록을 가져오는 중 에러가 발생했습니다.',
      });
    }
  };

  deleteCartItems = async (req: Request, res: Response) => {
    try {
      const parsedParams = DeleteCartItemRequestParamsSchema.parse(req.params);

      const cartItemId = await this.service.deleteCartItem(parsedParams.cartItemId);
      res.status(200).json({
        status: 'success',
        data: cartItemId,
      });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const { fieldErrors } = error.flatten();

        console.log(fieldErrors);
        res.status(400).json({
          status: 'fail',
          data: fieldErrors,
        });
      }

      if (error instanceof NotFoundError) {
        res.status(404).json({
          status: 'fail',
          data: { [error.resource]: error.message },
        });
      }

      res.status(500).json({
        status: 'error',
        data: '장바구니에 담긴 상품을 지우는 중 에러가 발생했습니다.',
      });
    }
  };
}

export default CartItemContorller;
