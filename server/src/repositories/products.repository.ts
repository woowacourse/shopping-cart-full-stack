import { Transaction } from "sequelize";
import { newProduct, Product } from "../interfaces/product.interface.js";
import { ProductModel } from "../models/index.js";
import { sequelize } from "../db/sequelize.js";

interface TxOption {
  transaction?: Transaction;
}

function toProduct(model: ProductModel): Product {
  return { id: model.id, name: model.name, stock: model.stock, imageUrl: model.imageUrl, price: model.price };
}

export async function isAlreadyExist(id: number): Promise<boolean> {
  return (await ProductModel.count({ where: { id } })) > 0;
}

export async function save(product: newProduct): Promise<void> {
  await ProductModel.create(product);
}

export async function findAll(): Promise<Product[]> {
  const models = await ProductModel.findAll({ order: [["id", "ASC"]] });
  return models.map(toProduct);
}

export async function findById(id: number): Promise<Product | undefined> {
  const model = await ProductModel.findByPk(id);
  if (!model) {
    return undefined;
  }
  return toProduct(model);
}

export async function deleteById(id: number): Promise<boolean> {
  const deleted = await ProductModel.destroy({ where: { id } });
  return deleted > 0;
}

export async function decreaseStock(id: number, options: TxOption & { quantity: number }): Promise<void> {
  await ProductModel.decrement("stock", { by: options.quantity, where: { id }, transaction: options.transaction });
}

export async function reset(): Promise<void> {
  await sequelize.query('TRUNCATE TABLE "products" RESTART IDENTITY CASCADE');
}
