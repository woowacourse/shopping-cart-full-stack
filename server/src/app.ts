import express from "express";
import { createProduct, deleteProduct, getProducts } from "./controllers/products.controller.js";
import { getCartItems, updateCartItemQuantity, deleteCartItem } from "./controllers/cart.controller.js";
import { getCoupons } from "./controllers/coupon.controller.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";
import { getOrderSummary } from "./controllers/order.controller.js";

const app = express();
app.use(express.json());

const corsOptions = {
  // 추후 프론트 배포 주소 추가
  origin: ["http://localhost:5173", "https://shopping-cart-full-stack-gamma.vercel.app"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
};

app.use(cors(corsOptions));

app.get("/products", getProducts);
app.post("/products", createProduct);
app.delete("/products/:id", deleteProduct);

app.get("/cart", getCartItems);
app.patch("/cart/:id", updateCartItemQuantity);
app.delete("/cart/:id", deleteCartItem);

app.post("/orders/summary", getOrderSummary);

app.post("/coupon", getCoupons);

app.use(errorHandler);

export default app;
