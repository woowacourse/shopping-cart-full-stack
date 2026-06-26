import { FieldError } from "./errors.js";
import { type ErrorResponse } from "./errors.js";
import { ValidatorMap } from "./types.js";

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

export function combinations<T>(arr: T[], k: number) {
  const result: T[][] = [];

  function combine(start: number, combo: T[]) {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      combine(i + 1, combo);
      combo.pop();
    }
  }

  combine(0, []);
  return result;
}
