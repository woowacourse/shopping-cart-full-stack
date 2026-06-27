import { z } from './z.js';

describe('z.object()', () => {
  const schema = z.object({
    quantity: z.number(),
    name: z.string(),
  });

  test('모든 필드가 통과하면 success:true 와 조립된 data를 반환한다', () => {
    const result = schema.safeParse({ quantity: 3, name: 'apple' });

    expect(result).toEqual({ success: true, data: { quantity: 3, name: 'apple' } });
  });

  test('입력이 object가 아니면 path:[] 로 실패한다', () => {
    const result = schema.safeParse(42);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([{ path: [], message: 'object 타입이어야 합니다' }]);
    }
  });

  test('한 필드가 실패하면 path에 필드키가 붙는다', () => {
    const result = schema.safeParse({ quantity: 'three', name: 'apple' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([{ path: ['quantity'], message: 'number 타입이어야 합니다' }]);
    }
  });

  test('여러 필드가 실패하면 모든 이슈를 모아서 반환한다', () => {
    const result = schema.safeParse({ quantity: 'three', name: 42 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([
        { path: ['quantity'], message: 'number 타입이어야 합니다' },
        { path: ['name'], message: 'string 타입이어야 합니다' },
      ]);
    }
  });

  test('중첩 object는 path가 누적된다', () => {
    const nested = z.object({
      item: z.object({ quantity: z.number() }),
    });

    const result = nested.safeParse({ item: { quantity: 'three' } });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([
        { path: ['item', 'quantity'], message: 'number 타입이어야 합니다' },
      ]);
    }
  });
});
