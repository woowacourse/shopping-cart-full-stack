src/
├── app.js
├── server.js
├── config/ # 환경변수, DB 설정
│ └── index.js
├── router/
│ └── index.js
├── modules/ # 도메인별로 묶음
│ ├── products/
│ │ ├── products.router.js # controller 함수를 메서드/엔드포인트별로 매핑
│ │ ├── products.controller.js # service를 호출해서 분기별로 적절한 response 응답
│ │ ├── products.service.js # repository를 호출해서 비즈니스 로직 수행 (유효성 검사 등)
│ │ ├── products.repository.js # (현재) 내장 메모리에 저장된 데이터에 직접 접근해 반환/수정/생성 (model 사용)
│ │ ├── products.model.js # 도메인 객체 class
│ │ └── products.dto.js # 요청/응답 객체 interface
│ └── cart/
│ ├── cart.router.js
│ ├── cart.controller.js
│ ├── cart.service.js
│ ├── cart.repository.js
│ ├── cart.model.js
│ └── cart.dto.js
└── common/
├── errors.js # 커스텀 에러 클래스
└── response.js # 응답 형식 통일
