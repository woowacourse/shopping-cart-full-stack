import type { Response } from "express";

type ServerResponse<T> = SuccessResponse<T> | FailResponse<T>;

interface SuccessResponse<T> {
  data: T;
  status: number;
}

interface FailResponse<T> {
  status: number;
  errorCode: string;
  errorMessage: string;
  data?: T;
}

export const success = <T>(res: Response, data: T, status = 200) => {
  return res.status(status).json({
    status,
    data,
  });
};

export const fail = <T>(
  res: Response,
  data: T,
  errorCode: string,
  errorMessage: string,
  status = 500,
) => {
  return res.status(status).json({
    status,
    data,
    errorCode,
    errorMessage,
  });
};
