# Project Structure

## File Tree
<!-- AUTO-GENERATED START -->
src
├── app.test.ts
├── app.ts
├── common
│   ├── error.ts
│   └── response.ts
├── index.ts
├── middleware
│   └── error.middleware.ts
├── modules
│   ├── carts
│   │   ├── carts.controller.ts
│   │   ├── carts.dto.ts
│   │   ├── carts.model.ts
│   │   ├── carts.repository.ts
│   │   ├── carts.router.test.ts
│   │   ├── carts.router.ts
│   │   ├── carts.service.test.ts
│   │   └── carts.service.ts
│   └── products
│       ├── products.controller.ts
│       ├── products.dto.ts
│       ├── products.model.ts
│       ├── products.repository.ts
│       ├── products.router.test.ts
│       ├── products.router.ts
│       ├── products.service.test.ts
│       └── products.service.ts
├── raw
│   ├── raw.carts.ts
│   └── raw.products.ts
├── router
│   └── index.ts
└── validate
    └── getMissingFields.ts

9 directories, 26 files

<!-- AUTO-GENERATED END -->

## Directory Descriptions

- modules/{domain}
: 도메인별로 관련 코드를 묶습니다.

* *.router.ts : controller 함수를 메서드/엔드포인트별로 매핑
* *.controller.ts : service를 호출해서 분기별로 적절한 response 응답
* *.service.ts : repository를 호출해서 비즈니스 로직 수행 (유효성 검사 등)
* *.repository.ts : 현재) 내장 메모리에 저장된 데이터에 직접 접근해 반환/수정/생성 (model 사용)
* *.model.ts : 도메인 객체 class
* *.dto.ts : 요청/응답 객체 interface

- validate
: 공통 유효성 검사 함수

- raw
: in-memory raw 데이터

- middleware
: 공통 express 미들웨어

- common

* errors.ts : 커스텀 에러 클래스
* response.ts : 공통 응답 형식
