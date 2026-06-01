import { Response } from "express";
import { InvalidError, NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";

export const handleError = (response: Response, error: unknown) => {
  if (error instanceof NotFoundError || error instanceof InvalidError) {
    return response
      .status(error.status)
      .json({ code: error.code, message: error.message });
  }

  return response
    .status(500)
    .json({ message: `${ERROR_MESSAGE.SERVER_ERROR}` });
};
