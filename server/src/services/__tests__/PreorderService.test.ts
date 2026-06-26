import {jest} from '@jest/globals';

const loadPreorderService = async () => {
  jest.resetModules();
  return import('../PreorderService.js');
};

describe('preorderService', () => {
  test('createPreorder는 선택한 장바구니 항목으로 preorderId를 생성한다', async () => {
    const {preorderService} = await loadPreorderService();

    const preorderId = preorderService.createPreorder({selectedCartIds: ['6']});

    expect(typeof preorderId).toBe('string');
    expect(preorderId.length).toBeGreaterThan(0);
  });

  test('getPreorder는 preorder 상품 정보를 반환한다', async () => {
    const {preorderService} = await loadPreorderService();
    const preorderId = preorderService.createPreorder({selectedCartIds: ['6']});

    const preorder = preorderService.getPreorder(preorderId);

    expect(preorder).toEqual({
      preorderId,
      items: [
        {
          productId: '6',
          price: 89000,
          name: '다중인격 콘티',
          imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=300&q=80',
          quantity: 5,
        },
      ],
    });
  });

  test('createPreorder는 request body가 유효하지 않으면 에러를 던진다', async () => {
    const {preorderService} = await loadPreorderService();

    expect(() => preorderService.createPreorder({selectedCartIds: []})).toThrow(
      'selectedCartIds를 올바르게 입력해주세요.'
    );
    expect(() => preorderService.createPreorder({selectedCartIds: [1]})).toThrow(
      'selectedCartIds를 올바르게 입력해주세요.'
    );
  });

  test('createPreorder는 존재하지 않는 장바구니 항목이면 에러를 던진다', async () => {
    const {preorderService} = await loadPreorderService();

    expect(() => preorderService.createPreorder({selectedCartIds: ['999']})).toThrow(
      '선택한 장바구니 항목을 찾을 수 없습니다.'
    );
  });

  test('getPreorder는 preorderId가 유효하지 않으면 에러를 던진다', async () => {
    const {preorderService} = await loadPreorderService();

    expect(() => preorderService.getPreorder('')).toThrow('preorderId를 올바르게 입력해주세요.');
    expect(() => preorderService.getPreorder(undefined)).toThrow('preorderId를 올바르게 입력해주세요.');
  });

  test('getPreorder는 존재하지 않는 preorder이면 에러를 던진다', async () => {
    const {preorderService} = await loadPreorderService();

    expect(() => preorderService.getPreorder('unknown')).toThrow('주문 확인 정보를 찾을 수 없습니다.');
  });

  test('getPreorder는 만료된 preorder이면 만료 에러를 던진다', async () => {
    const nowSpy = jest.spyOn(Date, 'now');
    const {preorderService} = await loadPreorderService();

    try {
      nowSpy.mockReturnValue(0);
      const preorderId = preorderService.createPreorder({selectedCartIds: ['6']});

      nowSpy.mockReturnValue(Number.MAX_SAFE_INTEGER);

      let thrownError: unknown;

      try {
        preorderService.getPreorder(preorderId);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).toBeInstanceOf(Error);
      expect((thrownError as Error).message).toBe('주문 확인 시간이 만료되었습니다.');
      expect(thrownError).toMatchObject({statusCode: 410});
    } finally {
      nowSpy.mockRestore();
    }
  });
});
