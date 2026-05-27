import express, { ErrorRequestHandler, response } from "express";
import { createProduct } from "./controllers/products.controller.js";
import { ZodError } from "zod";
import { ERROR_RESPONSE } from "./constants/error.js";

const app = express();
app.use(express.json());

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (error instanceof ZodError) {
    const errorCode = error.issues[0]?.message as keyof typeof ERROR_RESPONSE;

    response.status(400).json(ERROR_RESPONSE[errorCode]);
    return;
  }

  response.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "서버 내부 오류가 발생했습니다.",
  });
};

app.get("/products", () => {});
app.post("/products", createProduct);
app.delete("/products/:id", () => {});

app.get("/cart", () => {});
app.patch("/cart", () => {});
app.delete("/cart/:id", () => {});

app.use(errorHandler);

export default app;
