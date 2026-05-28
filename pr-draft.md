## 🕵️ 셀프 리뷰(Self-Review)

### 제출 전 체크 리스트

- [x] 기능 요구 사항을 모두 구현했고, 정상적으로 동작하는지 확인했나요?
- [x] 기본적인 프로그래밍 요구 사항(코드 컨벤션, 에러 핸들링 등)을 준수했나요?
- [x] 배포한 서버에 정상적으로 접근할 수 있나요?
  - 배포 링크: https://shopping-cart-full-stack-production-9304.up.railway.app/

### 리뷰 요청 & 논의하고 싶은 내용

#### 1) 이번 단계에서 가장 많이 고민했던 문제와 해결 과정에서 배운 점

**PUT vs PATCH 선택 근거**

장바구니 수량 변경 API 설계 시 PUT과 PATCH 중 무엇을 선택할지 고민했습니다.

아래 테스트 코드를 보면 PUT을 선택한 이유가 명확히 드러납니다.

```typescript
const productInCart: BodyForTest = {
  id: 1,
  imageUrl: 'https://example.com/nike.jpg',
  name: 'Nike Air Max',
  price: 1200000,
  quantity: 2,
};

const productToBeUpdated: BodyForTest = {
  id: productInCart.id,
  imageUrl: productInCart.imageUrl,
  name: productInCart.name,
  price: productInCart.price,
  quantity: 4,
};
```

`productInCart`는 프론트엔드 컴포넌트가 GET 요청으로 서버에서 받아온 최신 정보입니다. PUT 방식에서는 이 데이터를 그대로 들고 있다가 `quantity`만 수정해서 전송하면 됩니다. 즉, 사용자가 수동으로 필드를 일일이 구성할 필요 없이 서버에서 받아온 최신 상태를 기반으로 변경 사항만 덮어씌우는 방식이라 human error를 줄일 수 있습니다.

PATCH였다면 `{ id: 1, quantity: 4 }` 만 전송하는 설계가 되었을 것입니다. 하지만 전체 필드를 명시적으로 보내는 PUT 방식이 프론트엔드와 백엔드 모두에서 설계 의도가 더 뚜렷하다고 판단했습니다.

또한 멱등성 관점에서, 나중에 확장성을 고려했을 때 전체 필드를 보내야 하는 상황에서 PATCH는 같은 요청을 여러 번 보내도 결과가 동일하지 않을 수 있는 경우가 생길 수 있습니다. PUT은 같은 요청을 여러 번 보내도 항상 동일한 결과를 보장하므로 멱등성이 명확합니다.

---

**레이어 설계 철학 — nodejs, express와 친해지기**

이번 미션의 목표가 "완벽한 백엔드 설계"가 아니라 "nodejs, express와 친해지기"였기 때문에, 실제 백엔드처럼 class 기반 모델, controller / service / repository / DTO 레이어로 나누는 대신, DB를 하나의 객체로 두고 `Products`와 `Cart`를 각각 객체 배열로 관리하며 이를 테이블처럼 추상화하여 작업했습니다.

---

**100% TDD — AI 없이, 페어와 함께**

이번 구현에서 페어와 함께 AI를 전혀 사용하지 않고 100% TDD 사이클로 모든 API 엔드포인트를 구현했습니다.

테스트 레이어는 두 가지로 구분했습니다.

- **도메인 레이어** — `req`, `res`를 직접적으로 건드리지 않는 로직, 즉 검증 로직들을 도메인 로직으로 정의하고 Jest로 TDD 사이클(Red → Green → Refactor)을 거치며 구현했습니다.
- **HTTP 레이어** — 각 엔드포인트와 req/res body 설계를 도식화한 뒤, supertest로 TDD 사이클을 통해 API를 구현했습니다.

비록 실제 백엔드만큼의 깊이는 없지만, nodejs와 express 문법에 익숙해지고 이번에 새로 배우게 된 supertest와도 친해진 시간이었습니다.

---

**타입 시스템과 런타임 검증의 경계**

TypeScript 인터페이스가 있어도 런타임 검증이 별도로 필요하다는 것을 직접 확인했습니다. 타입은 컴파일 타임에만 동작하기 때문에 실제 HTTP 요청으로 들어오는 데이터는 타입 시스템이 보호해주지 않습니다. 이를 테스트로 검증하기 위해 `as RequestBody`로 타입을 의도적으로 우회하여 런타임 검증 함수를 테스트했습니다.

```typescript
const product = {
  imageUrl: 'http://example.com/image.jpg',
  price: 1000,
  quantity: 10,
} as RequestBody; // name 필드가 없음에도 타입 우회

Validator.validateRequiredFields(product); // 런타임에서 에러를 던져야 함
```

---

**테스트 격리 — `beforeEach`로 인메모리 DB 초기화**

인메모리 DB를 사용하다 보니 테스트 간 상태가 공유되는 문제가 있었습니다. 한 테스트에서 DB를 변경하면 다음 테스트의 결과에 영향을 주기 때문에, `beforeEach`에서 매 테스트마다 깊은 복사(spread)로 DB를 초기 상태로 되돌리는 패턴을 적용했습니다.

```typescript
const initialProducts = TestDB.Products!.map((product) => ({ ...product }));

beforeEach(() => {
  TestDB.Products = initialProducts.map((p) => ({ ...p }));
});
```

---

**트러블슈팅: 204 No Content에서 응답 body가 무시되는 문제**

처음에는 204 응답에도 성공 메시지를 body에 담아 보내려 했습니다.

```typescript
// Before
res.status(204).send({ message: '상품이 성공적으로 삭제되었습니다.' });

// 테스트
expect(response.body).toEqual({ message: '상품이 성공적으로 삭제되었습니다.' }); // 실패
```

테스트에서 response body가 빈 값으로 오는 것을 확인하고 조사한 결과, HTTP 스펙상 204 No Content는 응답 body를 포함하지 않아야 하며 Express도 이를 따라 body를 무시한다는 것을 배웠습니다.

```typescript
// After
res.status(204).send();

// 테스트
expect(response.status).toBe(204); // 성공
```

---

#### 2) 이번 리뷰를 통해 논의하고 싶은 부분

**① `RequestBody`를 DB 모델로 재사용한 구조에 대해**

현재 `database.ts`에서 DB 데이터 모델로 HTTP 요청 바디 타입인 `RequestBody`를 그대로 재사용하고 있습니다.

```typescript
interface DB {
  Products: RequestBody[];
  Cart: RequestBody[];
}
```

지금은 DB에 저장되는 데이터 구조와 요청 바디 구조가 동일해서 문제가 없지만, "DB 모델 = Request Body"가 항상 성립하지는 않는다는 걸 알고 있습니다. 이번 미션 범위에서는 이 정도로 충분하다고 판단했는데, 분리하는 것이 더 나은 설계인지 의견을 듣고 싶습니다.

**② 검증 전에 DB에 먼저 데이터가 추가되는 순서 문제에 대해**

현재 POST 엔드포인트에서 검증 실행 전에 DB에 먼저 데이터를 push하고 있습니다.

```typescript
DB.Products.push(newProduct); // 먼저 추가

try {
  Validator.validateRequestBody(req.body); // 그 다음 검증
  res.status(201).json({ message: '상품이 성공적으로 생성되었습니다.' });
} catch (error) {
  res.status(400).json({ errorMessage: error.message }); // 이미 DB에는 들어가 있는 상태
}
```

검증 실패 시 400을 응답하지만 잘못된 데이터가 DB에 이미 추가된 상태라는 문제를 인지하고 있습니다. 검증을 먼저 수행한 뒤 통과했을 때만 push하는 순서로 수정하는 것이 맞는지, 그리고 이런 순서 실수를 방지하기 위한 패턴이 있는지 의견을 듣고 싶습니다.

**③ `TestDB`와 실제 `DB`를 분리한 구조에 대해**

테스트에서 실제 `DB`를 import하지 않고 `TestDB`를 별도로 만들어 사용했습니다. 테스트 간 상태 격리와 실제 DB 오염 방지를 위한 선택이었는데, 더 나은 방법(예: 매 테스트마다 DB를 mock하거나 DI로 주입하는 방식 등)이 있는지 의견을 듣고 싶습니다.

**④ 레이어 분리와 클래스 기반 설계에 대해**

이번 미션에서는 "nodejs, express와 친해지기"라는 목표에 맞게 controller / service / repository / DTO 레이어로 나누거나 class 기반으로 모델을 관리하는 대신, 인메모리 DB를 객체 배열로 flat하게 유지하며 구현했습니다. 실제 프로덕션 수준의 Express 서버라면 어느 시점에, 어떤 기준으로 레이어를 나누기 시작하는 것이 좋은지 의견을 듣고 싶습니다.

**⑤ `Validator`를 객체 리터럴로 구현한 것에 대해**

```typescript
export const Validator = {
  validateRequiredFields(...) { ... },
  validateRequestBody(...) {
    this.validateRequiredFields(requestBody) && ...
  },
};
```

검증 로직을 class가 아닌 객체 리터럴로 구현했습니다. 지금은 상태(state)가 없어서 동작에 문제는 없지만, class로 만드는 것과 어떤 차이가 있는지, 그리고 `validateRequestBody`에서 `this`를 사용하고 있는데 객체 리터럴에서의 `this` 바인딩이 어떻게 동작하는지도 함께 의견을 듣고 싶습니다.

**⑥ CORS를 직접 헤더로 구현한 것에 대해**

```typescript
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
```

npm의 `cors` 패키지를 사용하는 대신 직접 헤더를 설정했습니다. CORS가 내부적으로 어떻게 동작하는지 이해하기 위한 선택이었는데, 실무에서는 어느 쪽을 더 선호하는지, 그리고 현재 구현에서 preflight `OPTIONS` 요청 처리가 빠져있는 부분에 대해 의견을 듣고 싶습니다.

---

| 문서 | 링크 |
| --- | --- |
| API 명세서 | [docs/api.md](docs/api.md) |
| 요구사항 명세서 | [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) |
