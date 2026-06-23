import { act, renderHook } from '@testing-library/react';

import { useMutation } from '../../src/shared/hooks/useMutation';

describe('useMutation', () => {
  test('mutation 결과를 반환하고 onSuccess에 전달한다.', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useMutation());

    let data: string | undefined;

    await act(async () => {
      data = await result.current.mutate(
        async () => 'mutation data',
        { onSuccess },
      );
    });

    expect(data).toBe('mutation data');
    expect(onSuccess).toHaveBeenCalledWith('mutation data');
    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('mutation 실패 시 error를 저장하고 onError에 전달한다.', async () => {
    const mutationError = new Error('mutation failed');
    const onError = jest.fn();
    const { result } = renderHook(() => useMutation());

    await act(async () => {
      await expect(
        result.current.mutate(
          async () => {
            throw mutationError;
          },
          { onError },
        ),
      ).rejects.toThrow('mutation failed');
    });

    expect(onError).toHaveBeenCalledWith(mutationError);
    expect(result.current.error).toBe(mutationError);
    expect(result.current.isPending).toBe(false);
  });
});
