interface ApiErrorProps {
  status: number;
  code?: string;
  message: string;
}

export default class ApiError extends Error {
  status: number;
  code?: string;

  constructor({ status, code, message }: ApiErrorProps) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}
