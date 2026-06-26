import { Transaction } from "sequelize";
import { CheckoutCoupon } from "../interfaces/checkout.interface.js";
import { CheckoutCouponModel } from "../models/index.js";
import { sequelize } from "../db/sequelize.js";

interface TxOption {
  transaction?: Transaction;
}

export async function findAllByCheckoutId(checkoutId: number, options: TxOption = {}): Promise<CheckoutCoupon[]> {
  const models = await CheckoutCouponModel.findAll({ where: { checkoutId }, transaction: options.transaction });
  return models.map(toCheckoutCoupon);
}

export async function deleteByCheckoutId(checkoutId: number, options: TxOption = {}): Promise<void> {
  await CheckoutCouponModel.destroy({ where: { checkoutId }, transaction: options.transaction });
}

export async function replaceByCheckoutId(
  checkoutId: number,
  options: TxOption & { couponIds: number[] },
): Promise<void> {
  await deleteByCheckoutId(checkoutId, { transaction: options.transaction });
  const uniqueIds = [...new Set(options.couponIds)];
  const rows = uniqueIds.map((couponId) => ({ checkoutId, couponId }));
  await CheckoutCouponModel.bulkCreate(rows, { transaction: options.transaction });
}

export async function reset(): Promise<void> {
  await sequelize.query('TRUNCATE TABLE "checkout_coupons" RESTART IDENTITY CASCADE');
}

function toCheckoutCoupon(model: CheckoutCouponModel): CheckoutCoupon {
  return { id: model.id, checkoutId: model.checkoutId, couponId: model.couponId };
}
