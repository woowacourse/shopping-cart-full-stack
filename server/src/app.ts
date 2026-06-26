import cors from "cors";
import express from "express";
import { createProduct, deleteProduct, getProducts } from "./controllers/products.controller.js";
import { getCartItems, updateCartItemQuantity, deleteCartItem } from "./controllers/cart.controller.js";
import {
  createCheckout,
  getCheckout,
  deleteCheckout,
  updateCheckoutAddress,
  updateCheckoutCoupons,
  getCouponDiscountPreview,
  payCheckout,
} from "./controllers/checkout.controller.js";
import { resetDemoDatabase } from "./controllers/reset.controller.js";
import errorHandler from "./middlewares/errorHandler.js";
import { validateProductId, validateCartItemId, validateCheckoutId } from "./middlewares/validateId.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const app = express();
app.use(
  cors({
    origin: [/\.github\.io$/, "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/products", getProducts);
app.post("/products", createProduct);
app.delete("/products/:id", validateProductId, deleteProduct);

app.get("/cart", getCartItems);
app.patch("/cart/:id", validateCartItemId, updateCartItemQuantity);
app.delete("/cart/:id", validateCartItemId, deleteCartItem);

app.post("/checkouts", createCheckout);
app.get("/checkouts/:checkoutId", validateCheckoutId, getCheckout);
app.delete("/checkouts/:checkoutId", validateCheckoutId, deleteCheckout);
app.patch("/checkouts/:checkoutId/address", validateCheckoutId, updateCheckoutAddress);
app.patch("/checkouts/:checkoutId/coupons", validateCheckoutId, updateCheckoutCoupons);
app.get("/checkouts/:checkoutId/coupons/discount-preview", validateCheckoutId, getCouponDiscountPreview);
app.post("/checkouts/:checkoutId/payment", validateCheckoutId, payCheckout);

app.post("/reset", resetDemoDatabase);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
