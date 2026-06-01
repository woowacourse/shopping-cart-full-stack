import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: error.name,
      message: error.message,
    });
  }

  console.error(error);
  res.status(500).json({ error: "InternalServerError" });
};
