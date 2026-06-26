import express, { Request, Response } from 'express';
import { DB } from '../database';
import { calculateOrderPreview, isCouponApplicable } from '../coupon-calculator';

const orderRouter = express.Router();
orderRouter.use(express.json());

const MAX_COUPONS = 2;

orderRouter.post('/preview', (req: Request, res: Response) => {
  if (!DB.Cart || !DB.Coupons) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }

  const { mode, selectedItemIds, coupons, isRemoteArea } = req.body ?? {};

  if (!Array.isArray(selectedItemIds) || selectedItemIds.length === 0) {
    return res.status(400).json({ errorMessage: '선택된 상품이 없습니다.' });
  }
  if (mode !== 'auto' && mode !== 'manual') {
    return res.status(400).json({ errorMessage: 'mode는 auto 또는 manual이어야 합니다.' });
  }
  if (mode === 'manual' && (!Array.isArray(coupons) || coupons.length > MAX_COUPONS)) {
    return res.status(400).json({ errorMessage: '쿠폰은 최대 2개까지 사용할 수 있습니다.' });
  }

  const items = DB.Cart.filter((item) => selectedItemIds.includes(item.id));
  const orderAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applicableCoupons = DB.Coupons.filter((coupon) =>
    isCouponApplicable(coupon.type, items, orderAmount, coupon.expirationDate),
  );
  const candidates = mode === 'auto'
    ? applicableCoupons
    : applicableCoupons.filter((coupon) => coupons.includes(coupon.id));

  const result = calculateOrderPreview(
    items,
    candidates,
    Boolean(isRemoteArea),
    DB.Coupons,
  );
  res.status(200).json(result);
});

export default orderRouter;
