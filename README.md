# 장바구니 풀스택 미션

상품 목록과 장바구니 항목을 관리하는 풀스택 미션 프로젝트입니다. 현재 구현 범위는 Express 기반 서버이며, 상품 조회/추가/삭제와 장바구니 조회/수량 변경/삭제 API를 제공합니다.

## 프로젝트 구성

```txt
shopping-cart-full-stack
├── docs
│   └── api.md
├── server
│   ├── package.json
│   └── src
│       ├── app.ts
│       ├── index.ts
│       ├── db.ts
│       ├── type.ts
│       ├── controllers
│       ├── services
│       ├── models
│       └── middlewares
└── README.md
```

## 서버 아키텍처

서버는 요청 처리 흐름을 다음 계층으로 나눕니다.

```txt
app.ts
  -> controller
  -> service
  -> model / db
```

- `app.ts`: 라우트와 공통 미들웨어를 등록합니다.
- `controllers`: HTTP 요청, 응답, 상태 코드를 다룹니다.
- `services`: API 유스케이스를 조립합니다.
- `models`: 상품과 장바구니 항목의 상태와 동작을 관리합니다.
- `db.ts`: 인메모리 초기 데이터를 구성합니다.
- `middlewares`: 라우트 핸들러 예외를 공통으로 처리합니다.

## 주요 모델

- `Product`: 상품 하나의 정보를 표현합니다.
- `Products`: 상품 목록의 조회, 추가, 삭제, 중복 확인을 담당합니다.
- `CartItem`: 장바구니 항목 하나와 수량 변경 동작을 표현합니다.
- `CartItems`: 장바구니 항목 목록의 조회, 수량 변경, 삭제를 담당합니다.

## API

상세 명세는 [docs/api.md](docs/api.md)를 참고합니다.

현재 제공하는 API는 다음과 같습니다.

- `GET /products`
- `POST /products`
- `DELETE /products/:id`
- `GET /carts`
- `PATCH /carts/:id`
- `DELETE /carts/:id`

## 실행

```bash
cd server
npm install
npm run dev
```

기본 포트는 `3000`입니다. `PORT` 환경 변수로 변경할 수 있습니다.

```bash
PORT=4000 npm run dev
```

## Railway 배포

Railway에서는 `server` 디렉터리를 하나의 Node.js 서비스로 배포합니다.

서비스 설정:
- Root Directory: `/server`
- Config file: `server/railway.json`
- Build Command: `npm run build`
- Start Command: `npm run start`

서버는 Railway가 주입하는 `PORT` 환경 변수를 사용합니다.

## 검증

```bash
cd server
npm run build
npx tsc -p tsconfig.json --noEmit
```

테스트 스크립트는 준비되어 있지만, 현재 작성된 테스트 파일은 없습니다.
