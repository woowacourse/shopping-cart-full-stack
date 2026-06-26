import { Sequelize } from "sequelize";

const DATABASE_URL = process.env.DATABASE_URL ?? "postgres://shopping:shopping@localhost:5432/shopping_cart";

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
