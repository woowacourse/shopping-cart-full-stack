import InMemoryStorage from "./storages/InMemoryStorage.js";
import StorageHandler from "./StorageHandler.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT ?? 3000;

const storageHandler = new StorageHandler(new InMemoryStorage());
const app = createApp<InMemoryStorage>(storageHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
