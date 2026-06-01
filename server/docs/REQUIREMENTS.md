## API 설계

-   [x] endpoint와 HTTP 메서드를 REST 원칙에 맞게 스스로 설계한다
-   [x] HTTP 상태 코드(200, 204, 201, 400, 404, 500 등) 사용 기준을 정하고 그 이유를 설명할 수 있다

## 서버

-   [x] Node.js + Express를 사용한다
-   [x] TypeScript 로 구현한다.
-   [x] 데이터는 DB 가 아니라 in-memory(배열 또는 Map)로 관리한다
-   [x] HTTP 상태 코드를 의미에 맞게 사용한다 (200, 201, 400, 404 등)
-   [x] FE와 연동을 위한 CORS 설정을 한다

## 테스트

-   [x] 도메인 로직과 API 요청을 100% 테스트 합니다.
-   [x] 도메인은 Jest, API 호출은 supertest 를 활용합니다.
-   [x] TDD 로 구현합니다.

## 검증

-   [x] 필수 필드 누락 시 에러를 응답한다
-   [x] 존재하지 않는 상품/장바구니 아이템 요청 시 에러를 응답한다
-   [x] quantity는 1 이상 99 이하의 정수여야 한다
-   [x] price는 0보다 큰 숫자여야 한다
-   [x] 상품명은 최대 100자이다

## 문서화

-   [x] 요구사항 문서를 docs/REQUIREMENTS.md 에 구체적으로 작성한다.
-   [x] docs/api.md 에 설계한 API 명세와 설계 결정 이유를 작성한다. (endpoint, request body, response body, http status code...)

## 도메인 테스트 케이스

### product service

#### getProducts

-   [x] 상품 리스트를 반환한다.

#### createProduct

-   [x] 필수 필드가 모두 존재하고 도메인 규칙에 맞는 경우 새 상품을 추가한다.
-   [x] 필수값이 누락된 경우 ServiceError를 던진다 (MISSING_FIELD)
    -   [x] price
    -   [x] name
    -   [x] imgUrl
-   [x] 전달받은 값의 타입이 하나라도 불일치하는 경우 ServiceError를 던진다 (TYPE_MISMATCH)
-   [x] 도메인 규칙에 맞지 않는 값이 포함된 경우 ServiceError를 던진다 (INVALID)
    -   [x] price가 0보다 큰 숫자가 아니면
    -   [x] name이 100자 초과이면

#### deleteProduct

-   [x] id에 해당하는 상품을 삭제한다
-   [x] 전달받은 id와 같은 항목이 DB에 존재하지 않는 경우 ServiceError를 던진다 (RESOURCE_NOT_FOUND)

### cart service

#### getCartById

-   [x] cartId에 해당하는 장바구니 상품 목록을 반환한다.
-   [x] 존재하지 않는 cartId로 조회하는 경우 ServiceError를 던진다 (RESOURCE_NOT_FOUND)

#### updateCartProduct

-   [x] 필수 필드가 모두 존재하고 도메인 규칙에 맞는 경우 장바구니 상품 수량을 변경한다.
-   [x] quantity가 누락된 경우 ServiceError를 던진다 (MISSING_FIELD)
-   [x] quantity 타입이 불일치하는 경우 ServiceError를 던진다 (TYPE_MISMATCH)
-   [x] 도메인 규칙에 맞지 않는 값이 포함된 경우 ServiceError를 던진다 (INVALID)
    -   [x] quantity가 1 이상 99 이하의 정수가 아니면
-   [x] 존재하지 않는 cartId로 요청하는 경우 ServiceError를 던진다 (RESOURCE_NOT_FOUND)
-   [x] 존재하지 않는 productId로 요청하는 경우 ServiceError를 던진다 (RESOURCE_NOT_FOUND)

#### deleteCartProduct

-   [x] cartId와 productId에 해당하는 장바구니 상품을 제거한다.
-   [ ] cartId 또는 productId 타입이 불일치하는 경우 ServiceError를 던진다 (TYPE_MISMATCH) -> request 형식 자체는 service의 검증 책임 아님
-   [x] 존재하지 않는 cartId 또는 productId로 요청하는 경우 ServiceError를 던진다 (RESOURCE_NOT_FOUND)

## API 호출 테스트 케이스

-   [x] products
-   [x] carts

### 공통 에러 케이스

-   [x] 엔드포인트에 해당하는 라우터가 없는 경우 404 ROUTE_NOT_FOUND 로 간주한다
-   [x] 엔드포인트에 대한 method 에 해당하는 라우터가 없는 경우 405 METHOD_NOT_ALLOWED 로 간주한다
-   [x] 요청 body가 json이 아닌 경우 400 NO_JSON으로 간주한다

## TODO

-   [ ] errorCode 상수화
-   [ ] 필수값 누락 예외 테스트 케이스 완성된 객체에서 필드 하나씩 제거하며 테스트하는 방식 -> 빈 객체 전달하여 배열에 모든 필수값과 errorCode를 반환하는지 확인하는 방식
-   [ ] 에러를 모두 service에서 반환하는 방식이 올바른 방식일까? -> service에서 http 관련 내용을 알고 있어야 하게 됨
    -   controller에서는 http 관련 에러(타입, json 형태,...)
    -   service에서는 도메인 관련 에러(price유효성, name 유효성 ,...)
-   [ ] last item id + 1 로직의 문제점: 삭제한 아이템과 동일한 id의 아이템이 추가될 수 있음
-   [ ] 상품 삭제 DELETE에 parameter로 받는 id 타입 검사 추가
-   [ ] updateCardProduct에서 CardUpdateOption 인자를 받을 때 확장성을 고려하여 만들었는데 repository에서는 updateProductQuantity라는 단일 함수로 구현됨 -> 동일한 확장성을 고려하여 범용성 있는 함수 설계 필요
-   [ ] /carts/products로 요청 시 404 resource not found 에러가 나고 있음 -> routes not found로 보내는 게 맞는지?
