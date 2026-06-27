export interface Issue {
  path: (string | number)[];
  message: string;
}

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: Issue[] } };

export abstract class ZodType<T> {
  abstract safeParse(input: unknown): ParseResult<T>;

  optional(): ZodOptional<T> {
    return new ZodOptional(this);
  }

  nullable(): ZodNullable<T> {
    return new ZodNullable(this);
  }

  default(value: T): ZodDefault<T> {
    return new ZodDefault(this, value);
  }

  catch(value: T): ZodCatch<T> {
    return new ZodCatch(this, value);
  }
}

export type Infer<S> = S extends ZodType<infer T> ? T : never;

export class ZodOptional<T> extends ZodType<T | undefined> {
  private readonly inner: ZodType<T>;

  constructor(inner: ZodType<T>) {
    super();
    this.inner = inner;
  }

  safeParse(input: unknown): ParseResult<T | undefined> {
    if (input === undefined) {
      return { success: true, data: undefined };
    }

    return this.inner.safeParse(input);
  }
}

export class ZodNullable<T> extends ZodType<T | null> {
  private readonly inner: ZodType<T>;

  constructor(inner: ZodType<T>) {
    super();
    this.inner = inner;
  }

  safeParse(input: unknown): ParseResult<T | null> {
    if (input === null) {
      return { success: true, data: null };
    }

    return this.inner.safeParse(input);
  }
}

export class ZodDefault<T> extends ZodType<T> {
  private readonly inner: ZodType<T>;
  private readonly defaultValue: T;

  constructor(inner: ZodType<T>, defaultValue: T) {
    super();
    this.inner = inner;
    this.defaultValue = defaultValue;
  }

  safeParse(input: unknown): ParseResult<T> {
    if (input === undefined) {
      return { success: true, data: this.defaultValue };
    }

    return this.inner.safeParse(input);
  }
}

export class ZodCatch<T> extends ZodType<T> {
  private readonly inner: ZodType<T>;
  private readonly catchValue: T;

  constructor(inner: ZodType<T>, catchValue: T) {
    super();
    this.inner = inner;
    this.catchValue = catchValue;
  }

  safeParse(input: unknown): ParseResult<T> {
    const result = this.inner.safeParse(input);
    if (result.success) {
      return result;
    }

    return { success: true, data: this.catchValue };
  }
}
