import { ERROR_CODE, ErrorCodeKey } from './errorCode.js';

// 에러 미들웨어에서 응답을 구성하려면 status/code를 외부에서 읽을 수 있어야 한다.
// readonly로 두어 인스턴스 생성 이후 값이 바뀌지 않도록 보호한다.
class AppError extends Error {
  public readonly status: number;
  public readonly code: ErrorCodeKey;

  constructor(errorKey: ErrorCodeKey) {
    const { code, status, message } = ERROR_CODE[errorKey];
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'AppError';
  }
}

export default AppError;
