## 장바구니 화면: 상품 목록 선택 박스를 클릭 했을 때

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Client as 클라이언트
    participant LocalStorage as 로컬 스토리지

    User->>Client: 상품 선택 체크박스 클릭
    Client->>Client: 선택된 상품 목록 상태 변경
    Client->>LocalStorage: 선택된 상품 ID 목록 저장
    LocalStorage-->>Client: 저장 완료

    Client->>Client: 선택된 상품을 기준으로 금액 계산<br/>(주문 금액, 배송비, 총 결제 금액)
    Client-->>User: 체크박스 상태 및 계산된 금액 반영
```

## 장바구니 화면: 주문 확인 버튼을 클릭 했을 때

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Client as 클라이언트
    participant Server as 서버
    participant DB as DB

    User->>Client: 주문 확인 버튼 클릭
    Client->>Server: POST /order-sheet<br/>Body: 선택한 상품 ID

    Server->>DB: 상품 ID로 상품 정보 조회
    DB-->>Server: 상품 정보 반환

    Server->>Server: 상품 존재 여부 검증

    alt 존재하지 않는 상품이 있는 경우
        Server-->>Client: 오류 응답
        Client-->>User: 주문 오류 안내
    else 모든 상품이 존재하는 경우
        Server->>Server: 주문 정보 생성 <br/>{상품 정보, 수량, 도서 산간 지역인지, 선택한 쿠폰(가장 할인 효과가 큰 조합)}
        Server->>DB: 주문 정보 저장
        DB-->>Server: 저장 결과 반환

        alt 저장 성공
            Server-->>Client: 201 Created
            Client-->>User: 주문 확인 페이지로 이동
        else 저장 실패
            Server-->>Client: 서버 오류 응답
            Client-->>User: 주문 실패 안내
        end
    end
```

## 주문 확인 페이지: 화면 진입

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Client as 클라이언트
    participant Server as 서버
    participant DB as DB

    User->>Client: 주문 확인 페이지로 이동
    Client->>Server: GET / order-sheet/:id
     Server->>DB: 주문서 ID로 주문서 및 상품 정보 조회
     DB-->>Server: 주문서 및 상품 정보 반환

    alt 주문서 id가 존재하지 않는 경우
      Server-->>Client: 오류 응답
      Client-->>User: 주문서 요청 실패 안내

    else 주문서 id가 존재하는 경우

     Server-->>Client: 200 OK<br/>{ items, isRemoteShippingArea,<br/>selectedCoupon, pricing }
     Client-->>User: 주문 확인 정보 렌더링
    end

    Client->>Server: GET /order-sheets/:id/pricing

    Server->>DB: 주문서 ID로 주문서 및 상품 정보 조회
    DB-->>Server: 주문서 및 상품 정보 반환

    alt 주문서가 존재하지 않는 경우
        Server-->>Client: 404 Not Found
        Client-->>User: 주문서 조회 실패 안내
    else 주문서가 존재하는 경우
        Server->>Server: 주문 금액 요약 계산
        Server-->>Client: 200 OK<br/>{orderAmount, couponDiscountAmount,shippingFee}
        Client-->>User: 주문서 및 결제 금액 렌더링
    end
```

## 주문 확인 페이지: 제주도 및 도서 산간 지역 선택 박스를 클릭했을 때

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Client as 클라이언트
    participant Server as 서버
    participant DB as DB

    User->>Client: 체크 박스 클릭
    Client->>Server: PATCH /order-sheet/:id/shipping-area<br/>{ isRemoteShippingArea: true }
    Server->>DB: 주문 정보에 도서 산간 정보 수정
    DB-->>Server: 수정 완료
    Server-->>Client: 204 NO CONTENT
    Client-->>User: 체크 상태 반영

    Client->>Server: Get /order-sheet/:id/pricing
    Server->>DB: 주문서 정보 조회
    DB-->>Server: 주문서 정보 반환

    Server->>DB: 상품 ID로 상품 정보 조회
    DB-->>Server: 상품 정보 반환

    Server->>Server: 주문서에 대한 금액 요약 정보 계산
    Server-->>Client: 200 OK<br/>{ orderAmount, couponDiscountAmount,<br/>shippingFee, totalPaymentAmount }
    Client-->>User: 변경된 배송비 및 결제 금액 반영

```

## 주문 확인 페이지: 쿠폰 적용하기 버튼을 클릭 했을 때

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Client as 클라이언트
    participant Server as 서버
    participant DB as DB

    User->>Client: 쿠폰 적용하기 버튼 클릭

    par 전체 쿠폰 정보 조회
    Client->>Server: GET /coupons
    Server->>DB: 전체 쿠폰 정보 조회
    DB-->>Server: 전체 쿠폰 정보 반환
    Server-->>Client: 200 OK<br/>{coupons}
    and 사용 가능한 쿠폰 조회
    Client->>Server: Get /order-sheet/:id/able-coupons
       Server->>DB: 주문서 및 상품 정보 조회
        DB-->>Server: 주문서 및 상품 정보 반환
        Server->>DB: 쿠폰 정보 조회
        DB-->>Server: 쿠폰 정보 반환
        Server->>Server: 쿠폰별 사용 가능 여부 판단
         Server-->>Client: 200 OK<br/>{able}
    end

    Client->>Client: 전체 쿠폰, 사용 가능한 쿠폰 코드,<br/>선택된 쿠폰 코드 조합
    Client-->>User: 사용 가능 여부와 선택 상태를 포함한<br/>쿠폰 목록 모달 렌더링

```

## 주문 확인 페이지: 쿠폰 선택 박스 버튼을 클릭 했을 때

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Client as 클라이언트
    participant Server as 서버
    participant DB as DB

    User->>Client: 쿠폰 선택 체크박스 클릭
    Client->>Server: POST /order-sheets/:orderSheetId/coupon-discount-preview<br/>{selectedCoupons}

    Server->>DB: 주문서 및 상품 정보 조회
    DB-->>Server: 주문서 및 상품 정보 반환

    Server->>DB: 선택한 쿠폰 정보 조회
    DB-->>Server: 쿠폰 정보 반환

    Server->>Server: 쿠폰 사용 가능 여부 검증

    alt 사용할 수 없는 쿠폰이 포함된 경우
        Server-->>Client: 오류 응답
        Client-->>User: 쿠폰 적용 실패 안내
    else 모든 쿠폰을 사용할 수 있는 경우
        Server->>Server: 예상 할인 금액 계산
        Server-->>Client: 200 OK<br/>{ couponDiscountPreview}
        Client->>Client: 임시 선택 쿠폰 및 할인 금액 상태 갱신
        Client-->>User: 체크박스와 예상 할인 금액 반영
    end
```

## 주문 확인 페이지: 할인 쿠폰 사용하기 버튼을 클릭 했을 때

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Client as 클라이언트
    participant Server as 서버
    participant DB as DB

    User->>Client: 할인 쿠폰 사용하기 버튼을 클릭
    Client->>Server: POST /order-sheet/:id/coupons<br/>{selectedCoupons}

    Server->>DB: 주문서 및 상품 정보 조회
    DB-->>Server: 주문서 및 상품 정보 반환

    Server->>DB: 선택한 쿠폰 정보 조회
    DB-->>Server: 쿠폰 정보 반환

    Server->>Server: 쿠폰 사용 가능 여부 검증

    alt 사용할 수 없는 쿠폰이 포함된 경우
        Server-->>Client: 오류 응답
        Client-->>User: 쿠폰 적용 실패 안내

  else 모든 쿠폰을 사용할 수 있는 경우
    Server->>DB: 주문서 정보에 선택된 쿠폰 정보 업데이트
    DB-->>Server: 저장 성공

    Client->>Server: Get /order-sheet/:id/pricing
    Server->>DB: 주문서 및 상품 정보 조회
    DB-->>Server: 주문서 및 상품 정보 반환

    Server->>Server: 주문서에 대한 금액 요약 정보 계산
    Server-->>Client: 200 OK<br/>{ orderAmount, couponDiscountAmount,<br/>shippingFee, totalPaymentAmount }


    Client-->>User: 변경된 배송비 및 결제 금액 반영
end


```
