import express from "express";
import Product from "./models/Product.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const product1 = new Product("수건", 10000, "/some_image2");
const product2 = new Product("양말", 3000, "/some_image1");
export const products = new Map([
  [product1.getId(), product1],
  [product2.getId(), product2],
]);

app.get("/api/products/", (_req, res) => {
  res.send({
    products: [...products.values()].map((product) => product.getProduct()),
  });
});

app.post("/api/products/", (req, res) => {
  const { name, price, thumbnail } = req.body;
  const product = new Product(name, price, thumbnail);
  products.set(product.getId(), product);
  const post = { id: product.getProduct().id };

  res.status(201).send(post);
});

app.delete("/api/products/:id/", (req, res) => {
  const { id } = req.params;
  products.delete(id);
  res.status(204).send();
});

export default app;
