import { runApp } from "./app";
import InMemoryCartRepository from "./repositories/InMemoryCartRepository";
import InMemoryProductRepository from "./repositories/InMemoryProductRepository";

const PORT = process.env.PORT ?? 3000;

const repositories = {
  productRepo: new InMemoryProductRepository(),
  cartRepo: new InMemoryCartRepository()
}

const app = runApp(repositories);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
