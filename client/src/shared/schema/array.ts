import { ZodType, type Infer, type Issue, type ParseResult } from "./core.js";

export class ZodArray<Element extends ZodType<unknown>> extends ZodType<Infer<Element>[]> {
  private readonly element: Element;

  constructor(element: Element) {
    super();
    this.element = element;
  }

  safeParse(input: unknown): ParseResult<Infer<Element>[]> {
    if (!Array.isArray(input)) {
      return { success: false, error: { issues: [{ path: [], message: "array 타입이어야 합니다" }] } };
    }

    const data: unknown[] = [];
    const issues: Issue[] = [];

    input.forEach((item, index) => {
      const result = this.element.safeParse(item);
      if (result.success) {
        data[index] = result.data;
      } else {
        for (const issue of result.error.issues) {
          issues.push({ path: [index, ...issue.path], message: issue.message });
        }
      }
    });

    if (issues.length > 0) {
      return { success: false, error: { issues } };
    }

    return { success: true, data: data as Infer<Element>[] };
  }
}
