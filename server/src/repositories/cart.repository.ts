import { Transaction } from "sequelize";
import { CartItem, newCartItem } from "../interfaces/cart.interface.js";
import { CartItemModel } from "../models/index.js";
import { sequelize } from "../db/sequelize.js";

interface TxOption {
  transaction?: Transaction;
}

function toCartItem(model: CartItemModel): CartItem {
  return { id: model.id, productId: model.productId, quantity: model.quantity };
}

export async function isAlreadyExist(id: number): Promise<boolean> {
  return (await CartItemModel.count({ where: { id } })) > 0;
}

export async function saveNewItem(newItem: newCartItem): Promise<void> {
  await CartItemModel.create(newItem);
}

export async function updateItemQuantity(id: number, quantity: number): Promise<void> {
  await CartItemModel.update({ quantity }, { where: { id } });
}

export async function deleteById(id: number): Promise<boolean> {
  const deleted = await CartItemModel.destroy({ where: { id } });
  return deleted > 0;
}

export async function deleteByProductId(productId: number, options: TxOption = {}): Promise<boolean> {
  await CartItemModel.destroy({ where: { productId }, transaction: options.transaction });
  return true;
}

export async function findAll(): Promise<CartItem[]> {
  const models = await CartItemModel.findAll({ order: [["id", "ASC"]] });
  return models.map(toCartItem);
}

export async function findById(id: number): Promise<CartItem | undefined> {
  const model = await CartItemModel.findByPk(id);
  if (!model) {
    return undefined;
  }
  return toCartItem(model);
}

export async function reset(): Promise<void> {
  await sequelize.query('TRUNCATE TABLE "cart_items" RESTART IDENTITY CASCADE');
}
