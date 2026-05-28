export type ValidatorMap = Record<string, ((value: any) => void)[]>;

export function runValidate(
  validatorMap: ValidatorMap,
  body: Record<string, unknown>,
): Record<string, string[]> {
  const errors: Record<string, string[]> = Object.fromEntries(
    Object.keys(validatorMap).map((key) => [key, []]),
  );

  for (const [fieldName, validators] of Object.entries(validatorMap)) {
    const value = body[fieldName];
    try {
      validators.forEach((validator) => {
        validator(value);
      });
    } catch (err) {
      errors[fieldName].push((err as Error).message);
    }
  }

  return errors;
}
