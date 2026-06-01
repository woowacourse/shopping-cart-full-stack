import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).send();
  }
  res.status(500).send();
};
