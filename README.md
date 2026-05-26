# 장바구니 풀스택 미션
## 기능 요구사항 구현 순서 정리
### 도메인 로직 테스트
#### 상품 목록 테스트
- [] 상품 목록 조회 테스트
- [] 상품 목록 추가 테스트
- [] 상품 목록 제거 테스트
  - [] cascading으로 장바구니 목록도 제거 필요
#### 장바구니 목록 테스트
- [] 장바구니 목록 조회 테스트
- [] 장바구니 목록 추가 테스트
- [] 장바구니 수량 변경 테스트
- [] 장바구니 목록 제거 테스트

### API 호출 테스트
#### 상품 목록 관련 API 테스트
- [] GET /products
- [] POST /products
- [] DELETE /products/:productId
#### 장바구니 관련 API 테스트
- [] GET /cart
- [] POST /cart
- [] DELETE /cart/:cartId
- [] PATCH /cart/:cartId
