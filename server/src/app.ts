import express from "express";
import cors from 'cors';
import cartRouter from './routes/CartRouter';
import productRouter from './routes/ProductRouter';

const app = express();

app.use(cors());
app.use(express.json());
app.use("/cart", cartRouter);
app.use("/products", productRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
