import { sequelize } from "../src/db/sequelize.js";
import "../src/models/index.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
