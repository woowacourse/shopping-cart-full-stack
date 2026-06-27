import { describe, it, expect } from 'vitest';
import { formatPrice } from './price';

describe('formatPrice', () => {
  it('금액을 세 자리마다 콤마로 포맷한다', () => {
    expect(formatPrice(168000)).toBe('168,000');
  });

  it('0원도 문자열로 포맷한다', () => {
    expect(formatPrice(0)).toBe('0');
  });
});
