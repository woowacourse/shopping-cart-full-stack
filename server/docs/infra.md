# 목표

- 실제 DB를 사용한다.
- Redis는 사용하지 않는다.
- Oracle Cloud 작은 VM에서 견딜 수 있게 가볍게 구성한다.
- GitHub Container Registry(GHCR)에 Docker image를 올리고, Oracle Cloud VM에서 Docker container로 실행한다.
- client는 GitHub Pages로 배포하고, production API 주소는 Caddy가 받은 서버 도메인으로 연결한다.

# Infra

## 배포 구성

```txt
GitHub Pages Client
GitHub Actions
GHCR
Caddy
Express Docker
PostgreSQL Docker
```

## 배포 흐름

```txt
push to step4
  ├─ client 변경: GitHub Pages 배포
  │   └─ VITE_API_BASE_URL=https://${SERVER_DOMAIN}
  └─ server 변경: Docker image build
      └─ GHCR push: ghcr.io/<owner>/<repo>-server:<git-sha>
          └─ Oracle VM SSH 접속
              └─ docker compose pull && docker compose up -d
```

- 변경된 폴더만 배포한다.
  - `client/**` 변경 시 client deploy job 실행
  - `server/**` 변경 시 server image build/deploy job 실행
  - `.github/workflows/deploy.yml` 변경 시 양쪽 job 실행
- 서버 image 이름은 workflow에서 lowercase로 정규화한다.
- VM의 `/home/ubuntu/shopping-cart`에 `docker-compose.yml`, `Caddyfile`을 미리 둔다.
- workflow는 배포 때마다 같은 디렉터리에 `.env`를 생성/갱신한다.

### `.env` 예시

```env
SERVER_IMAGE=ghcr.io/inaemin/shopping-cart-full-stack-server:<git-sha>
SERVER_DOMAIN=api.example.com
POSTGRES_USER=shopping
POSTGRES_PASSWORD=********
POSTGRES_DB=shopping_cart
```

### GHCR

- GitHub Actions에서 `GITHUB_TOKEN`으로 `ghcr.io`에 로그인해 server image를 push한다.
- server image package는 첫 push 후 GitHub Packages에서 Public으로 전환한다.
  - 현재 VM 배포 script는 `docker login ghcr.io`를 하지 않는다.
  - 따라서 Public package여야 Oracle VM에서 인증 없이 pull할 수 있다.
- Private package로 유지하려면 VM pull용 GitHub PAT(`read:packages`)와 `docker login ghcr.io` 단계가 추가로 필요하다.

### Oracle VM

- Ubuntu 24.04 기준 기본 user는 `ubuntu`를 사용한다.
- 기본 배포 디렉터리: `/home/ubuntu/shopping-cart`
- VM에는 Docker Engine과 Docker Compose plugin이 설치되어 있어야 한다.
- 배포 user는 `docker` 명령을 실행할 수 있어야 한다.
- Oracle Cloud Security List 또는 NSG에서 `22`, `80`, `443` 포트를 연다.

### Caddy

- reverse proxy 역할
- HTTPS 처리
- Express container로 요청 전달
- `SERVER_DOMAIN` 환경변수를 읽어 해당 도메인으로 TLS 인증서를 발급/갱신한다.
- 외부 `80`, `443` 요청을 내부 `server:3000`으로 전달한다.

### Express Docker

- Node.js + Express server
- ORM으로 Sequelize 사용
- DB connection pool을 작게 유지
- GHCR에서 pull한 `SERVER_IMAGE`로 실행한다.
- `DATABASE_URL`로 PostgreSQL container에 연결한다.

### PostgreSQL Docker

- RDBMS
- 주문/결제/쿠폰 도메인의 관계, 트랜잭션, 제약조건을 담당
- Redis 없이 PostgreSQL만으로 상태를 관리
- `postgres-data` volume에 데이터를 유지한다.
- 작은 VM 기준 PostgreSQL resource 설정을 보수적으로 둔다.

# ORM

## 선택

- Sequelize

## 이유

- 가벼움 우선
- Prisma보다 Docker 빌드/런타임 구성이 단순하다.
- Prisma처럼 배포 전에 Client generate 단계를 따로 관리하지 않아도 된다.
  - Docker build에서 schema 파일 복사 순서, generate 실행 시점, 생성 산출물 포함 여부를 신경 쓸 일이 줄어든다.
- 별도 engine/runtime 의존성이 적다.
- 작은 Express 서버에 붙이기 쉽다.

## 비교

### Prisma

> DX와 타입 안정성은 가장 좋지만, 가벼움 최우선 기준에서는 제외.

- 장점
  - TypeScript DX 좋음
  - schema 기반 모델링이 명확함
  - migration 흐름이 좋음
- 단점
  - Prisma Client generate 필요
    - Docker build에서 generate 타이밍과 산출물 포함 여부를 관리해야 한다.
  - Docker 빌드 과정이 상대적으로 무거워짐
  - 작은 VM에서는 Sequelize보다 구성이 단순하지 않음

### Sequelize

> 이번 서버 구현의 1순위 후보.

- 장점
  - JS/TS 런타임 ORM
  - Docker 구성 단순
  - 작은 서버에 가볍게 붙이기 좋음
  - migration CLI 사용 가능
- 단점
  - Prisma보다 타입 안정성과 DX는 약함
  - 모델 타입 선언을 더 직접 관리해야 함

### TypeORM

> 이번 프로젝트에는 비추천.

- 데코레이터, reflect-metadata, TS 설정 등 복잡도가 높다.
- 마이그레이션/엔티티 패턴이 현재 규모에 비해 무겁다.
- 작은 VM에서 얻는 이점보다 복잡도가 더 크다.

# DB

## 선택

- PostgreSQL

## 이유

- 주문/결제/쿠폰 도메인은 관계와 트랜잭션이 중요하다.
- 제약조건, 인덱스, JSON, 관계 스키마 확장에 여유가 있다.
- MySQL도 가능하지만 새로 고른다면 PostgreSQL이 더 무난하다.
- Docker에서 PostgreSQL과 MySQL의 차이보다 connection 수와 메모리 설정이 더 중요하다.

# Resource

## 작은 VM 기준

> Caddy + Express + PostgreSQL을 같은 VM에서 띄울 예정이므로 보수적으로 잡는다.

### PostgreSQL

```txt
max_connections = 10~20
shared_buffers = 128MB
work_mem = 2MB~4MB
maintenance_work_mem = 32MB~64MB
```

### Sequelize pool

```ts
pool: {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000,
}
```

## 원칙

- DB connection을 많이 열지 않는다.
- Express container는 stateless하게 둔다.
- Redis는 필요해질 때까지 도입하지 않는다.
- 트래픽이 낮은 동안은 단일 VM + 단일 DB container로 시작한다.
- Docker image에는 secret을 넣지 않는다.
- DB 비밀번호와 SSH key는 GitHub Secrets에만 둔다.
- `POSTGRES_PASSWORD`는 현재 `DATABASE_URL`에 직접 들어가므로 `@`, `:`, `/`, `%`, `$`, `#` 같은 문자는 피한다.

# 최종 판단

- 가벼움 최우선이면 Sequelize + PostgreSQL.
- 타입 안정성과 DX를 더 중요하게 보면 Prisma + PostgreSQL.
- 현재 목표는 Oracle Cloud 작은 VM에서 Docker로 가볍게 운영해보는 것이므로 Sequelize + PostgreSQL로 간다.
- registry는 GHCR을 사용한다. GitHub Actions의 `GITHUB_TOKEN`으로 server image를 push할 수 있고, public package로 전환하면 VM에서 별도 registry 로그인 없이 pull할 수 있기 때문이다.
