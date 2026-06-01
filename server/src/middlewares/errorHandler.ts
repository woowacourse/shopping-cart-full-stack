import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ERROR_RESPONSE } from "../constants/error.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (error instanceof ZodError) {
    const errorCode = error.issues[0]?.message as keyof typeof ERROR_RESPONSE;
    const { status, code, message } = ERROR_RESPONSE[errorCode];
    response.status(status).json({ code, message });
    return;
  }

  if (error instanceof Error) {
    const errorCode = error.message as keyof typeof ERROR_RESPONSE;
    const { status, code, message } = ERROR_RESPONSE[errorCode];
    response.status(status).json({ code, message });
    return;
  }

  /* istanbul ignore next */
  response.status(ERROR_RESPONSE.INTERNAL_SERVER_ERROR.status).json({
    code: ERROR_RESPONSE.INTERNAL_SERVER_ERROR.code,
    message: ERROR_RESPONSE.INTERNAL_SERVER_ERROR.message,
  });
};

export default errorHandler;
