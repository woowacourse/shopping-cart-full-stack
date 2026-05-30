import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import productRouter from "./productApi.ts";
import shoppingCartRouter from "./shoppingCartApi.ts";
import {
  BadRequestError,
  NotFoundError,
  RequestTimeoutError,
  NotImplementedError,
} from "./error.ts";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", productRouter);
app.use("/carts", shoppingCartRouter);

app.get("/slow", async (_req, res, next) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3001));

    if (!res.headersSent) {
      throw new RequestTimeoutError({
        message: "요청 시간이 초과되었습니다.",
        field: "time out",
      });
    }
  } catch (error) {
    next(error);
  }
});

app.use((_req, res) => {
  throw new NotFoundError({
    message: "유효하지 않은 경로입니다.",
    field: "wrong url",
  });
});

app.use((_req, res, next) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      throw new RequestTimeoutError({
        message: "요청 시간이 초과되었습니다.",
        field: "time out",
      });
    }
  }, 3000);

  res.on("finish", () => {
    clearTimeout(timeout);
  });

  next();
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof BadRequestError) {
    return res.status(400).send({
      message: error.message,
      field: error.field,
    });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).send({
      message: error.message,
      field: error.field,
    });
  }
  if (error instanceof RequestTimeoutError) {
    return res.status(408).send({
      message: error.message,
      field: error.field,
    });
  }
  if (error instanceof NotImplementedError) {
    return res.status(501).send({
      message: error.message,
      field: error.field,
    });
  }

  return res.status(500).send({ message: "서버 내부 오류입니다." });
};

app.use(errorHandler);

export default app;
