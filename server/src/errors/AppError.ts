import ERROR_CODES from "@/ERROR_CODE";

export class AppError extends Error {
  constructor(public code: keyof typeof ERROR_CODES) {
    super(ERROR_CODES[code].message);
  }
}
