import { sequelize } from "./sequelize.js";
import { seedDatabase } from "./seed.js";
import "../models/index.js";

async function resetDatabase(): Promise<void> {
  await sequelize.sync({ force: true });
  await seedDatabase();
  await sequelize.close();
}

void resetDatabase();
