import { Op, Transaction } from "sequelize";
import { Checkout, newCheckout } from "../interfaces/checkout.interface.js";
import { CheckoutModel } from "../models/index.js";
import { sequelize } from "../db/sequelize.js";

interface TxOption {
  transaction?: Transaction;
}

export async function create({ remoteArea }: newCheckout, options: TxOption = {}): Promise<Checkout> {
  const model = await CheckoutModel.create({ remoteArea }, { transaction: options.transaction });
  return toCheckout(model);
}

export async function findById(id: number, options: TxOption = {}): Promise<Checkout | undefined> {
  const model = await CheckoutModel.findByPk(id, { transaction: options.transaction });
  if (!model) {
    return undefined;
  }
  return toCheckout(model);
}

export async function updateRemoteArea(id: number, options: TxOption & { remoteArea: boolean }): Promise<void> {
  await CheckoutModel.update({ remoteArea: options.remoteArea }, { where: { id }, transaction: options.transaction });
}

export async function deleteById(id: number, options: TxOption = {}): Promise<boolean> {
  const deleted = await CheckoutModel.destroy({ where: { id }, transaction: options.transaction });
  return deleted > 0;
}

export async function findIdsOlderThan(expiredAt: number): Promise<number[]> {
  const models = await CheckoutModel.findAll({ where: { createdAt: { [Op.lt]: new Date(expiredAt) } } });
  return models.map((model) => model.id);
}

export async function reset(): Promise<void> {
  await sequelize.query('TRUNCATE TABLE "checkouts" RESTART IDENTITY CASCADE');
}

function toCheckout(model: CheckoutModel): Checkout {
  return { id: model.id, remoteArea: model.remoteArea, createdAt: model.createdAt.getTime() };
}
