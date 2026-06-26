type Rule<T> = (val: T) => string | null;

function throwIfInvalid<T>(rules: Array<Rule<T>>, val: T): void {
  const error = rules.map((rule) => rule(val)).find((result): result is string => result !== null);
  if (error !== undefined) {
    throw new ZodError([{ message: error }]);
  }
}

class StringSchema {
  private rules: Array<Rule<string>> = [];
  private typeError?: string;

  constructor(options?: { error?: string }) {
    this.typeError = options?.error;
  }

  public min(n: number, message?: string): StringSchema {
    this.rules.push((val) => {
      if (val.length >= n) {
        return null;
      }
      return message ?? "too short";
    });
    return this;
  }

  public max(n: number, message?: string): StringSchema {
    this.rules.push((val) => {
      if (val.length <= n) {
        return null;
      }
      return message ?? "too long";
    });
    return this;
  }

  public parse(val: unknown) {
    if (typeof val !== "string") {
      throw new ZodError([{ message: this.typeError ?? "Not a string" }]);
    }
    throwIfInvalid(this.rules, val);
    return val;
  }
}

class NumberSchema {
  private rules: Array<Rule<number>> = [];
  private typeError?: string;

  constructor(options?: { error?: string }) {
    this.typeError = options?.error;
  }

  public min(n: number, message?: string): NumberSchema {
    this.rules.push((val) => {
      if (val >= n) {
        return null;
      }
      return message ?? "too small";
    });
    return this;
  }

  public max(n: number, message?: string): NumberSchema {
    this.rules.push((val) => {
      if (val <= n) {
        return null;
      }
      return message ?? "too large";
    });
    return this;
  }

  public int(message?: string): NumberSchema {
    this.rules.push((val) => {
      if (Number.isInteger(val)) {
        return null;
      }
      return message ?? "not an integar";
    });
    return this;
  }

  public positive(message?: string): NumberSchema {
    this.rules.push((val) => {
      if (val > 0) {
        return null;
      }
      return message ?? "not a positive";
    });
    return this;
  }

  public parse(val: unknown) {
    if (typeof val !== "number") {
      throw new ZodError([{ message: this.typeError ?? "Not a number" }]);
    }
    throwIfInvalid(this.rules, val);
    return val;
  }
}

type InferShape<S extends Record<string, { parse: (val: unknown) => unknown }>> = {
  [K in keyof S]: ReturnType<S[K]["parse"]>;
};

class ObjectSchema<S extends Record<string, { parse: (val: unknown) => unknown }>> {
  constructor(private shape: S) {}

  public parse(val: unknown): InferShape<S> {
    if (typeof val !== "object" || val === null) {
      throw new ZodError([{ message: "Not an object" }]);
    }
    const result: Record<string, unknown> = {};
    for (const key in this.shape) {
      result[key] = this.shape[key].parse((val as Record<string, unknown>)[key]);
    }
    return result as InferShape<S>;
  }
}

class BooleanSchema {
  private typeError?: string;

  constructor(options?: { error?: string }) {
    this.typeError = options?.error;
  }

  public parse(val: unknown): boolean {
    if (typeof val !== "boolean") {
      throw new ZodError([{ message: this.typeError ?? "Not a boolean" }]);
    }
    return val;
  }
}

class ArraySchema<T> {
  private rules: Array<Rule<T[]>> = [];

  constructor(private schema: { parse: (val: unknown) => T }) {}

  public minLength(n: number, message?: string): ArraySchema<T> {
    this.rules.push((val) => {
      if (val.length >= n) {
        return null;
      }
      return message ?? "too short";
    });
    return this;
  }

  public parse(val: unknown): T[] {
    if (!Array.isArray(val)) {
      throw new ZodError([{ message: "Not an Array" }]);
    }
    const result = val.map((item) => this.schema.parse(item));
    throwIfInvalid(this.rules, result);
    return result;
  }
}

class NullableSchema<T> {
  constructor(private schema: { parse: (val: unknown) => T }) {}

  public parse(val: unknown): T | null {
    if (val === null) {
      return null;
    }
    return this.schema.parse(val);
  }
}

class OptionalSchema<T> {
  constructor(private schema: { parse: (val: unknown) => T }) {}

  public parse(val: unknown): T | undefined {
    if (val === undefined) {
      return undefined;
    }
    return this.schema.parse(val);
  }
}

export class ZodError extends Error {
  public issues: Array<{ message: string }>;

  constructor(issues: Array<{ message: string }>) {
    super("Validation failed");
    this.issues = issues;
  }
}

export const z = {
  string: (options?: { error?: string }) => new StringSchema(options),
  number: (options?: { error?: string }) => new NumberSchema(options),
  boolean: (options?: { error?: string }) => new BooleanSchema(options),
  object: <S extends Record<string, { parse: (val: unknown) => unknown }>>(shape: S) => new ObjectSchema(shape),
  array: <T>(schema: { parse: (val: unknown) => T }) => new ArraySchema(schema),
  nullable: <T>(schema: { parse: (val: unknown) => T }) => new NullableSchema(schema),
  optional: <T>(schema: { parse: (val: unknown) => T }) => new OptionalSchema(schema),
};

export type infer<S extends { parse: (val: unknown) => unknown }> = ReturnType<S["parse"]>;
