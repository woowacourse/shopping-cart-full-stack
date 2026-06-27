import { ZodType, type Infer, type Issue, type ParseResult } from "./core.js";

export type ZodShape = Record<string, ZodType<unknown>>;

export type InferShape<Shape extends ZodShape> = {
  [K in keyof Shape]: Infer<Shape[K]>;
};

type UnknownKeys = "strip" | "strict";

export class ZodObject<Shape extends ZodShape> extends ZodType<
  InferShape<Shape>
> {
  private readonly shape: Shape;
  private readonly unknownKeys: UnknownKeys;

  constructor(shape: Shape, unknownKeys: UnknownKeys = "strip") {
    super();
    this.shape = shape;
    this.unknownKeys = unknownKeys;
  }

  strict(): ZodObject<Shape> {
    return new ZodObject(this.shape, "strict");
  }

  safeParse(input: unknown): ParseResult<InferShape<Shape>> {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return {
        success: false,
        error: { issues: [{ path: [], message: "object 타입이어야 합니다" }] },
      };
    }

    const record = input as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    const issues: Issue[] = [];

    for (const [key, schema] of Object.entries(this.shape)) {
      const result = schema.safeParse(record[key]);
      if (result.success) {
        data[key] = result.data;
      } else {
        for (const issue of result.error.issues) {
          issues.push({ path: [key, ...issue.path], message: issue.message });
        }
      }
    }

    if (this.unknownKeys === "strict") {
      const known = new Set(Object.keys(this.shape));
      for (const key of Object.keys(record)) {
        if (!known.has(key)) {
          issues.push({ path: [key], message: "알 수 없는 키입니다" });
        }
      }
    }

    if (issues.length > 0) {
      return { success: false, error: { issues } };
    }

    return { success: true, data: data as InferShape<Shape> };
  }
}
