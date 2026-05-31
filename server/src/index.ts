import InMemoryStorage from "./storages/InMemoryStorage.js";
import { createApp } from "./app.js";
import { createCartController } from "./controllers/cartController.js";
import { createProductController } from "./controllers/productController.js";

const PORT = process.env.PORT ?? 3000;

const storage = new InMemoryStorage();
const productController = createProductController(storage);
const cartController = createCartController(storage);
const app = createApp({ productController, cartController });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
