import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ERROR_RESPONSE } from "../constants/error.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (error instanceof ZodError) {
    const errorCode = error.issues[0]?.message as keyof typeof ERROR_RESPONSE;
    response.status(400).json(ERROR_RESPONSE[errorCode]);
    return;
  }

  /* istanbul ignore next */
  response.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "서버 내부 오류가 발생했습니다.",
  });
};

export default errorHandler;
