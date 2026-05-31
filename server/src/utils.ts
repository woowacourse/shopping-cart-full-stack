import { FieldError } from "./errors.js";
import { type ErrorResponse } from "./errors.js";

export type ValidatorMap = Record<string, ((value: any) => void)[]>;

export function runValidate(
  validatorMap: ValidatorMap,
  body: Record<string, unknown>,
): Record<string, ErrorResponse> {
  const errors: Record<string, ErrorResponse> = {};

  for (const [fieldName, validators] of Object.entries(validatorMap)) {
    const value = body[fieldName];
    try {
      validators.forEach((validator) => {
        validator(value);
      });
    } catch (err) {
      errors[fieldName] = {
        code: (err as FieldError).code,
        message: (err as FieldError).message,
      };
    }
  }

  return errors;
}
