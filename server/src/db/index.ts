import { sequelize } from "./sequelize.js";
import { seedDatabase } from "./seed.js";
import "../models/index.js";

export async function initDatabase(): Promise<void> {
  await sequelize.authenticate();
  await sequelize.sync();
  await seedDatabase();
}
