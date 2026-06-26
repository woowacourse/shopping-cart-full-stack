import express, { Request, Response } from 'express';
import { DB } from '../database';

const couponRouter = express.Router();

couponRouter.get('/', (req: Request, res: Response) => {
  if (!DB.Coupons) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  res.status(200).json(DB.Coupons);
});

export default couponRouter;
