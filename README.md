# 장바구니 풀스택 미션

상품 목록, 장바구니, 주문 확인, 쿠폰, 주문 생성 흐름을 구현한 풀스택 미션 프로젝트입니다.

현재 구현 범위는 다음과 같습니다.

- 상품/장바구니 API
- 선택 장바구니 항목 기반 preorder 생성 및 조회
- 쿠폰 목록 조회와 추천 쿠폰 계산
- 배송 조건과 쿠폰 기준 결제 금액 미리보기
- 주문 생성과 주문 요약 조회
- React 클라이언트의 장바구니, 주문 확인, 쿠폰 모달, 결제 확인 화면

## 프로젝트 구성

```txt
shopping-cart-full-stack
├── client
│   ├── src
│   │   ├── domains
│   │   │   ├── cart
│   │   │   ├── coupon
│   │   │   ├── order-preview
│   │   │   ├── order
│   │   │   └── preorder
│   │   ├── design-system
│   │   ├── shared
│   │   └── test
│   └── package.json
├── server
│   ├── src
│   │   ├── app.ts
│   │   ├── caches
│   │   ├── controllers
│   │   ├── data
│   │   ├── domain
│   │   ├── middlewares
│   │   ├── models
│   │   ├── repositories
│   │   ├── services
│   │   └── types
│   ├── test
│   └── package.json
├── docs
│   ├── api.md
│   ├── REQUIREMENTS.md
│   └── system-design.md
└── README.md
```

## 클라이언트 구조

클라이언트는 도메인별 기능을 `client/src/domains` 아래에 둡니다.

- `cart`: 장바구니 조회, 선택, 수량 변경, 주문 확인 시작
- `preorder`: 장바구니와 확정 주문 사이의 임시 주문 세션 API/조회 훅
- `coupon`: 쿠폰 목록 API와 쿠폰 조회 훅
- `order-preview`: 주문 확인 페이지, 결제 금액 미리보기, 쿠폰 모달 상태
- `order`: 주문 생성 API, 주문 요약 조회, 결제 확인 페이지
- `design-system`: 공통 버튼, 체크박스, 타이포, 피드백 상태 UI
- `shared`: 공용 API 요청 유틸, 공통 정책 상수, 여러 도메인이 공유하는 레이아웃

## 서버 구조

서버는 요청 처리 흐름을 다음 계층으로 나눕니다.

```txt
app.ts
  -> controller
  -> service
  -> model / repository / domain policy
```

- `app.ts`: 라우트와 공통 미들웨어를 등록합니다.
- `controllers`: HTTP 요청, 응답, 상태 코드를 다룹니다.
- `services`: API 유스케이스를 조립합니다.
- `models`: 상품, 장바구니, 쿠폰, 주문의 상태와 동작을 관리합니다.
- `domain`: 쿠폰 적용, 주문 금액, 배송비 같은 순수 정책 계산을 담당합니다.
- `repositories`: 인메모리 데이터 저장소 접근 지점을 제공합니다.
- `caches`: preorder 같은 TTL 기반 인메모리 주문 세션을 관리합니다.
- `data`: 미션용 초기 상품, 장바구니, 쿠폰 데이터를 하드코딩합니다.
- `middlewares`: 라우트 핸들러 예외를 공통으로 처리합니다.
- `types`: API와 도메인에서 공유하는 타입을 정의합니다.

## API

상세 명세는 [docs/api.md](docs/api.md)를 참고합니다.

현재 제공하는 API는 다음과 같습니다.

- `GET /products`
- `POST /products`
- `DELETE /products/:productId`
- `GET /carts`
- `PATCH /carts/:cartItemId`
- `DELETE /carts/:cartItemId`
- `POST /preorder`
- `GET /preorder/:preorderId`
- `GET /coupons?preorderId={preorderId}&isRemoteArea={isRemoteArea}`
- `POST /order/preview`
- `POST /order`
- `GET /order/:orderId`

## 실행

서버:

```bash
cd server
npm install
npm run dev
```

클라이언트:

```bash
cd client
npm install
npm run dev
```

서버 기본 포트는 `3000`입니다. `PORT` 환경 변수로 변경할 수 있습니다.

```bash
cd server
PORT=4000 npm run dev
```

클라이언트 API 서버 주소는 빌드 환경의 `__API_BASE_URL__` 설정을 사용하며, 설정이 없으면 기본 배포 서버를 사용합니다.

## 검증

서버:

```bash
cd server
npm test
npm run build
npx tsc -p tsconfig.json --noEmit
```

클라이언트:

```bash
cd client
npm test
npm run typecheck
npm run build
```

테스트는 다음 기준으로 배치합니다.

- 서버 모델/서비스 단위 테스트: `server/src/**/__tests__`
- 서버 API 테스트: `server/test`
- 클라이언트 단위/페이지/API 테스트: 대상 도메인 또는 컴포넌트와 같은 폴더의 `*.test.ts(x)`

## Railway 배포

Railway에서는 `server` 디렉터리를 하나의 Node.js 서비스로 배포합니다.

서비스 설정:

- Root Directory: `/server`
- Config file: `server/railway.json`
- Build Command: `npm run build`
- Start Command: `npm run start`

서버는 Railway가 주입하는 `PORT` 환경 변수를 사용합니다.
