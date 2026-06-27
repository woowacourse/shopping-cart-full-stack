// 인증이 아직 없어 고정된 더미 유저 하나만 사용한다. 저장소 구조는 userId로 데이터를 구분해
// 멀티유저를 받을 수 있게 해두고, 실제 인증이 붙으면 이 상수 대신 요청에서 식별한 userId로 교체한다.
export const DUMMY_USER_ID = 'dummy-user';

