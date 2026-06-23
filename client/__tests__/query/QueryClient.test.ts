import { QueryClient } from '../../src/shared/query/QueryClient';

describe('QueryClient', () => {
  test('캐시 변경 시 queryKey 구독자에게 알린다.', () => {
    const queryClient = new QueryClient();
    const listener = jest.fn();

    queryClient.subscribe('query', listener);
    queryClient.setQueryData('query', 'data');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData('query')).toBe('data');
  });

  test('동일 queryKey의 진행 중 요청을 공유한다.', async () => {
    const queryClient = new QueryClient();
    const queryFn = jest.fn().mockResolvedValue('data');

    const firstRequest = queryClient.fetchQuery('query', queryFn);
    const secondRequest = queryClient.fetchQuery('query', queryFn);

    await expect(firstRequest).resolves.toBe('data');
    await expect(secondRequest).resolves.toBe('data');
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  test('reset 이전에 시작된 요청 결과는 캐시에 저장하지 않는다.', async () => {
    const queryClient = new QueryClient();
    let resolveQuery: (data: string) => void = () => {};
    const queryFn = () =>
      new Promise<string>((resolve) => {
        resolveQuery = resolve;
      });

    const request = queryClient.fetchQuery('query', queryFn);
    queryClient.reset();
    resolveQuery('old data');
    await request;

    expect(queryClient.getQueryData('query')).toBeUndefined();
  });
});
