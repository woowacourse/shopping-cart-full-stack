import express from "express";
import cors from 'cors';
import cartRouter from './routes/CartRouter';
import productRouter from './routes/ProductRouter';

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/cart", cartRouter);
app.use("/products", productRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
 