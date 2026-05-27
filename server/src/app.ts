import express from "express";
import Product from "./models/Product.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const products = [
  new Product("수건", 10000, "/some_image2"),
  new Product("양말", 3000, "/some_image1"),
];

app.get("/api/products/", (_req, res) => {
  res.send({ products: products.map((product) => product.getProduct()) });
});

app.post("/api/products/", (_req, res) => {
  const { name, price, thumbnail } = _req.body;

  const product = new Product(name, price, thumbnail);
  products.push(product);
  const post = { id: product.getProduct().id };

  res.status(201).send(post);
});

export default app;
