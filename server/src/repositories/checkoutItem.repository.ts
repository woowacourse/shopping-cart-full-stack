import { Transaction } from "sequelize";
import { CheckoutItem, newCheckoutItem } from "../interfaces/checkout.interface.js";
import { CheckoutItemModel } from "../models/index.js";
import { sequelize } from "../db/sequelize.js";

interface TxOption {
  transaction?: Transaction;
}

export async function bulkCreate(checkoutId: number, options: TxOption & { items: newCheckoutItem[] }): Promise<void> {
  const rows = options.items.map((item) => ({ checkoutId, productId: item.productId, quantity: item.quantity }));
  await CheckoutItemModel.bulkCreate(rows, { transaction: options.transaction });
}

export async function findAllByCheckoutId(checkoutId: number, options: TxOption = {}): Promise<CheckoutItem[]> {
  const models = await CheckoutItemModel.findAll({ where: { checkoutId }, transaction: options.transaction });
  return models.map(toCheckoutItem);
}

export async function deleteByCheckoutId(checkoutId: number, options: TxOption = {}): Promise<void> {
  await CheckoutItemModel.destroy({ where: { checkoutId }, transaction: options.transaction });
}

export async function reset(): Promise<void> {
  await sequelize.query('TRUNCATE TABLE "checkout_items" RESTART IDENTITY CASCADE');
}

function toCheckoutItem(model: CheckoutItemModel): CheckoutItem {
  return { id: model.id, checkoutId: model.checkoutId, productId: model.productId, quantity: model.quantity };
}
