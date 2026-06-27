import { z } from './z.js';

describe('z.string()', () => {
  test('string이면 success:true 와 data를 반환한다', () => {
    const result = z.string().safeParse('hi');

    expect(result).toEqual({ success: true, data: 'hi' });
  });

  test('string이 아니면 success:false 와 error.issues를 반환한다', () => {
    const result = z.string().safeParse(42);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([{ path: [], message: 'string 타입이어야 합니다' }]);
    }
  });
});

describe('z.number()', () => {
  test('number이면 success:true 와 data를 반환한다', () => {
    const result = z.number().safeParse(42);

    expect(result).toEqual({ success: true, data: 42 });
  });

  test('number가 아니면 success:false 와 error.issues를 반환한다', () => {
    const result = z.number().safeParse('hi');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([{ path: [], message: 'number 타입이어야 합니다' }]);
    }
  });
});
