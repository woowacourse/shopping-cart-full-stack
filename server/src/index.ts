import InMemoryStorage from "./storages/InMemoryStorage.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT ?? 3000;

const app = createApp(new InMemoryStorage());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
