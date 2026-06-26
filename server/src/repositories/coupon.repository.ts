import { Coupon, CouponCategory } from "../interfaces/coupon.interface.js";
import { CouponModel } from "../models/index.js";
import { sequelize } from "../db/sequelize.js";

export async function findAll(): Promise<Coupon[]> {
  const models = await CouponModel.findAll({ order: [["id", "ASC"]] });
  return models.map(toCoupon);
}

export async function findAllByIds(ids: number[]): Promise<Coupon[]> {
  const models = await CouponModel.findAll({ where: { id: ids } });
  return models.map(toCoupon);
}

export async function reset(): Promise<void> {
  await sequelize.query('TRUNCATE TABLE "coupons" RESTART IDENTITY CASCADE');
}

function nullableToOptional<T>(value: T | null): T | undefined {
  if (value === null) {
    return undefined;
  }
  return value;
}

function toCouponCondition(model: CouponModel) {
  return {
    amount: nullableToOptional(model.amount),
    rate: nullableToOptional(model.rate),
    minOrderAmount: nullableToOptional(model.minOrderAmount),
    usableStartAt: nullableToOptional(model.usableStartAt),
    usableEndAt: nullableToOptional(model.usableEndAt),
  };
}

function toCoupon(model: CouponModel): Coupon {
  return {
    id: model.id,
    couponCode: model.couponCode,
    name: model.name,
    expiredDate: model.expiredDate,
    category: model.category as CouponCategory,
    ...toCouponCondition(model),
  };
}
