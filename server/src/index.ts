import app from "./app.js";
import { initDatabase } from "./db/index.js";
import { startCheckoutCleanupScheduler } from "./schedulers/checkout.scheduler.js";

const PORT = process.env.PORT ?? 3000;

async function bootstrap(): Promise<void> {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    startCheckoutCleanupScheduler();
  });
}

void bootstrap();
