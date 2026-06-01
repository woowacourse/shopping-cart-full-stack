src/
├── app.ts
├── index.ts
├── router/
│   └── index.ts
├── modules/            # 도메인별로 묶음
│   ├── products/
│   │   ├── products.router.ts           # controller 함수를 메서드/엔드포인트별로 매핑
│   │   ├── products.controller.ts       # service를 호출해서 분기별로 적절한 response 응답
│   │   ├── products.service.ts          # repository를 호출해서 비즈니스 로직 수행 (유효성 검사 등)
│   │   ├── products.repository.ts       # (현재) 내장 메모리에 저장된 데이터에 직접 접근해 반환/수정/생성 (model 사용)
│   │   ├── products.model.ts            # 도메인 객체 class
│   │   └── products.dto.ts              # 요청/응답 객체 interface
│   └── carts/
│       ├── carts.router.ts
│       ├── carts.controller.ts
│       ├── carts.service.ts
│       ├── carts.repository.ts
│       ├── carts.model.ts
│       └── carts.dto.ts
├── validate/                           # 공통 유효성 검사 함수
│   └── getMissingFields.ts
├── raw/                                # in-memory raw 데이터
│   ├── raw.carts.ts
│   └── raw.products.ts
├── middleware/
│   └── error.middleware.ts             # 공통 에러 middleware
└── common/
    ├── errors.ts       # 커스텀 에러 클래스
    └── response.ts     # 응답 형식 통일