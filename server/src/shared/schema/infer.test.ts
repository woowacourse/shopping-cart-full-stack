import { z } from './z.js';

// 타입 레벨 단언 헬퍼: T에 할당 가능한 값만 받는다 (런타임은 no-op, 검증은 tsc가)
const assertType = <T>(_value: T): void => {};

describe('z.infer (타입 레벨)', () => {
  test('object 스키마에서 정확한 타입이 유도된다', () => {
    const bodySchema = z.object({
      quantity: z.number(),
      name: z.string(),
    });

    type Body = z.infer<typeof bodySchema>;
    // Body === { quantity: number; name: string }  (손으로 쓴 인터페이스를 대체)

    const result = bodySchema.safeParse({ quantity: 3, name: 'apple' });
    if (result.success) {
      assertType<Body>(result.data);
      assertType<number>(result.data.quantity);
      assertType<string>(result.data.name);
      // @ts-expect-error - 스키마에 없는 필드는 타입 에러 (정밀하게 좁혀졌다는 증거)
      result.data.nonexistent;
    }

    expect(result.success).toBe(true);
  });

  test('중첩 object도 타입이 누적 유도된다', () => {
    const schema = z.object({
      user: z.object({ name: z.string() }),
      total: z.number(),
    });

    const result = schema.safeParse({ user: { name: 'kim' }, total: 5 });
    if (result.success) {
      assertType<{ user: { name: string }; total: number }>(result.data);
      assertType<string>(result.data.user.name);
    }

    expect(result.success).toBe(true);
  });
});
