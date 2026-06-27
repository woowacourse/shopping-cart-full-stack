import { z } from "./z.js";

const assertType = <T>(_value: T): void => {};

describe("z.array()", () => {
  const schema = z.array(z.number());

  test("모든 원소가 통과하면 success:true 와 배열을 반환한다", () => {
    expect(schema.safeParse([1, 2, 3])).toEqual({ success: true, data: [1, 2, 3] });
  });

  test("빈 배열도 통과한다", () => {
    expect(schema.safeParse([])).toEqual({ success: true, data: [] });
  });

  test("배열이 아니면 path:[] 로 실패한다", () => {
    const result = schema.safeParse("nope");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([{ path: [], message: "array 타입이어야 합니다" }]);
    }
  });

  test("원소가 실패하면 path에 인덱스가 붙는다", () => {
    const result = schema.safeParse([1, "two", 3]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([{ path: [1], message: "number 타입이어야 합니다" }]);
    }
  });

  test("object 배열은 path가 [인덱스, 필드]로 누적된다", () => {
    const objects = z.array(z.object({ id: z.string() }));

    const result = objects.safeParse([{ id: "a" }, { id: 42 }]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([
        { path: [1, "id"], message: "string 타입이어야 합니다" },
      ]);
    }
  });

  test("출력 타입이 Infer<Element>[] 로 유도된다", () => {
    const strings = z.array(z.string());

    const result = strings.safeParse(["a", "b"]);
    if (result.success) {
      assertType<string[]>(result.data);
    }

    expect(result.success).toBe(true);
  });
});
