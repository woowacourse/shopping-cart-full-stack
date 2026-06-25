import express from "express";
import cors from "cors";
import cartRouter from "./routes/CartRouter";
import productRouter from "./routes/ProductRouter";
import orderRouter from "./routes/OrderRouter";
import couponRouter from "./routes/CouponRouter";

const app = express();

app.use(
  cors({
    origin: [
      /\.vercel\.app$/,
      "http://localhost:3000",
      "http://localhost:5173",
    ],
  }),
);
app.use(express.json());
app.use("/cart", cartRouter);
app.use("/products", productRouter);
app.use("/order", orderRouter);
app.use("/coupons", couponRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
