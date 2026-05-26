## API 설계
- [ ] endpoint와 HTTP 메서드를 REST 원칙에 맞게 스스로 설계한다
- [ ] HTTP 상태 코드(200, 204, 201, 400, 404, 500 등) 사용 기준을 정하고 그 이유를 설명할 수 있다

## 서버
- [ ] Node.js + Express를 사용한다
- [ ] TypeScript 로 구현한다.
- [ ] 데이터는 DB 가 아니라 in-memory(배열 또는 Map)로 관리한다
- [ ] HTTP 상태 코드를 의미에 맞게 사용한다 (200, 201, 400, 404 등)
- [ ] FE와 연동을 위한 CORS 설정을 한다

## 테스트
- [ ] 도메인 로직과 API 요청을 100% 테스트 합니다.
- [ ] 도메인은 Jest, API 호출은 supertest 를 활용합니다.
- [ ] TDD 로 구현합니다.

## 검증
- [ ] 필수 필드 누락 시 에러를 응답한다
- [ ] 존재하지 않는 상품/장바구니 아이템 요청 시 에러를 응답한다
- [ ] quantity는 1 이상 99 이하의 정수여야 한다
- [ ] price는 0보다 큰 숫자여야 한다
- [ ] 상품명은 최대 100자이다

## 문서화
- [ ] 요구사항 문서를 docs/REQUIREMENTS.md 에 구체적으로 작성한다.
- [ ] docs/api.md 에 설계한 API 명세와 설계 결정 이유를 작성한다. (endpoint, request body, response body, http status code...)