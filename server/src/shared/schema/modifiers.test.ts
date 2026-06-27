import { z } from "./z.js";

const assertType = <T>(_value: T): void => {};

describe(".optional() — 타입 확장형 래퍼", () => {
  test("undefined는 통과시키고, 그 외엔 inner에 위임한다", () => {
    const schema = z.string().optional();

    expect(schema.safeParse(undefined)).toEqual({
      success: true,
      data: undefined,
    });
    expect(schema.safeParse("hi")).toEqual({ success: true, data: "hi" });
    expect(schema.safeParse(42).success).toBe(false); // inner(string) 검증 실패
  });

  test("출력 타입이 T | undefined 로 확장된다", () => {
    const schema = z.string().optional();
    const result = schema.safeParse("hi");
    if (result.success) {
      assertType<string | undefined>(result.data);
    }
    expect(result.success).toBe(true);
  });
});

describe(".nullable() — 타입 확장형 래퍼", () => {
  test("null은 통과시키고, 그 외엔 inner에 위임한다", () => {
    const schema = z.string().nullable();

    expect(schema.safeParse(null)).toEqual({ success: true, data: null });
    expect(schema.safeParse("hi")).toEqual({ success: true, data: "hi" });
    expect(schema.safeParse(42).success).toBe(false);
  });

  test("출력 타입이 T | null 로 확장된다", () => {
    const schema = z.string().nullable();
    const result = schema.safeParse(null);
    if (result.success) {
      assertType<string | null>(result.data);
    }
    expect(result.success).toBe(true);
  });
});

describe(".default(v) — 값 치환형 래퍼 (undefined → 기본값)", () => {
  test("undefined면 기본값, 그 외엔 inner에 위임한다", () => {
    const schema = z.boolean().default(true);

    expect(schema.safeParse(undefined)).toEqual({ success: true, data: true });
    expect(schema.safeParse(false)).toEqual({ success: true, data: false });
    expect(schema.safeParse("nope").success).toBe(false);
  });

  test("출력 타입은 T 그대로 (undefined 안 붙음)", () => {
    const schema = z.boolean().default(true);
    const result = schema.safeParse(undefined);
    if (result.success) {
      assertType<boolean>(result.data);
    }
    expect(result.success).toBe(true);
  });
});

describe(".catch(v) — 값 치환형 래퍼 (실패 → 폴백값)", () => {
  test("검증 실패면 폴백값, 성공이면 그 값", () => {
    const schema = z.number().catch(0);

    expect(schema.safeParse("not a number")).toEqual({
      success: true,
      data: 0,
    });
    expect(schema.safeParse(5)).toEqual({ success: true, data: 5 });
  });
});

describe(".strict() — 알 수 없는 키 거부 (object 전용)", () => {
  const schema = z.object({ quantity: z.number() }).strict();

  test("스키마에 없는 키가 있으면 실패한다", () => {
    const result = schema.safeParse({ quantity: 1, extra: 2 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([
        { path: ["extra"], message: "알 수 없는 키입니다" },
      ]);
    }
  });

  test("정확히 맞는 키만 있으면 통과한다", () => {
    expect(schema.safeParse({ quantity: 1 })).toEqual({
      success: true,
      data: { quantity: 1 },
    });
  });

  test("기본(strip)은 모르는 키를 조용히 버린다", () => {
    const loose = z.object({ quantity: z.number() });
    expect(loose.safeParse({ quantity: 1, extra: 2 })).toEqual({
      success: true,
      data: { quantity: 1 },
    });
  });
});

describe("object 필드에 모디파이어 결합 — Infer 자동 확장", () => {
  test("optional/nullable 필드가 타입에 반영된다", () => {
    const schema = z.object({
      name: z.string(),
      nickname: z.string().optional(),
      deletedAt: z.string().nullable(),
    });

    const result = schema.safeParse({
      name: "kim",
      nickname: undefined,
      deletedAt: null,
    });
    if (result.success) {
      assertType<{
        name: string;
        nickname: string | undefined;
        deletedAt: string | null;
      }>(result.data);
    }
    expect(result.success).toBe(true);
  });
});
