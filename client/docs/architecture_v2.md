# Route

- /cart
- /checkout/:checkoutId
- /order-success

# Pages

## CheckoutPage

### useCheckout

- isLoading
- hasError
- checkoutItemList
- couponList
- orderAmount
- couponDiscount
- shippingFee
- totalAmount
- remoteArea
- refetch
- cancelCheckout
- submitCheckout

### useUpdateCheckout

- updateRemoteArea
- updateAppliedCoupon
- pending: isUpdating

### useBlocker

- 결제 성공 전 다른 path로 이동하려고 하면 blocked
- blocked 상태가 되면 `cancelCheckout` 호출 후 `blocker.proceed()`
- 결제 성공 시에는 `isSuccessfullyPaidRef`를 true로 바꿔서 cancelCheckout 방지

### useEffect

- blocker.state가 blocked일 때 `cancelCheckout` 호출

### states

- [isCouponModalOpened, setCouponModalOpened] = useState(false)

### refs

- isSuccessfullyPaidRef = useRef(false)

### functions

- handleToggleRemoteArea
- handleCloseModal
- handleApplyCoupon(selectedCouponIds)
  - await updateAppliedCoupon(selectedCouponIds)
  - handleCloseModal
- handleSubmitCheckout
  - submitCheckout
  - isSuccessfullyPaidRef.current = true
  - navigate.to "/order-success"
    - state에 response 넣어줌
    - 다음페이지로 replace

### views

```
<Header>
    <Header.BackButton />
</Header>
<main>
    <h1>주문 확인</h1>
    {isLoading && <SkeletonList />}
    {hasError && <ErrorList onRetry={refetch} />}
    <p>
        총 {}종류의 상품 {}개를 주문합니다.</br>
        최종 결제 금액을 확인해 주세요.
    </p>

    {CheckoutItems.map(item => <CheckoutItem item={item} />)}

    <div css={}>
        <Button variant="secondary" disabled={isUpdating}>
            <span className="">쿠폰 적용</span>
        </Button>
    </div>

    <h3>배송 정보</h3>
    <CheckBox checked={remoteArea} disabled={isUpdating} /> 제주도 및 도서 산간 지역

    <CheckoutSummary>

    <CouponModal checkoutId couponList initialCouponDiscount onApplyCoupon onClose /> // 쿠폰선택모달
</main>
<footer>
    <Button disabled={!isLoaded}>
        <span className="">결제하기</span>
    </Button>
</footer>
```

## OrderSuccessPage

- navigate state를 검사해서 없으면 장바구니 페이지로 돌아감
- itemCount, totalQuantity, totalAmount

# Components

## CouponModal

> extends Modal.
> `isCouponModalOpened`가 true일 때만 마운트된다. (조건부 렌더링 → 닫으면 unmount)
> 따라서 '사용하기'를 누르지 않고 닫으면 selectedCouponIds가 사라지고, 다시 열 때 `initialCouponIds`(= 서버에 저장된 적용 쿠폰)로 재초기화되어 복구된다.

### props

- checkoutId: number
- couponList: Coupon[]
- initialCouponDiscount: number
- onApplyCoupon: (selectedCouponIds: number[]) => void
- onClose: () => void

### variables

- initialCouponIds = couponList.filter((coupon) => coupon.isSelected).map(coupon => coupon.id)

### useCouponPolicy

- { maxCouponCount }

### useCalculateCoupon

- {isPending, isDirty, selectedCouponIds, toggleCouponCheckBox, estimatedCouponDiscount } = useCalculateCoupon(checkoutId, initialCouponIds, initialCouponDiscount)

### functions

- isCouponChecked()
  - selectedCouponIds에 coupon.id가 포함되어있다면 true
  - 아님 false
- isCouponDisabled():
  - selectedCouponIds에 포함되어있지 않으면서 selectedCouponIds.length가 이미 maxCouponCount라면 비활성화
  - 이미 쿠폰 데이터에서 disabled 되어있다면 비활성화
- handleApplyCoupon():
  - onApplyCoupon(selectedCouponIds)
  - onClose()

### views

```
<Modal>
    <Modal.Header>
        <h1>쿠폰을 선택해 주세요</h1>
        <Modal.CloseButton onClick={onClose}>
    </Modal.Header>
    <Modal.Main>
    <p><InfoIcon/> 쿠폰은 최대 {maxCouponCount}개까지 사용할 수 있습니다.</p>
    {couponList.map(<CouponItem coupon={coupon} isChecked disabled onChange />)}
    </Modal.Main>
    <Modal.Footer>
        <Button disabled={isPending || !isDirty} onClick={handleApplyCoupon}>
            {isPending ? <Loader /> : <span>총 {estimatedCouponDiscount}원 할인 쿠폰 사용하기</span>}
        </Button>
    </Modal.Footer>
</Modal>
```

### CouponItem

#### props

- Coupon
- isChecked = isCouponChecked()
- disabled = isCouponDisabled()
- onChange = toggleCouponCheckBox()

#### views

```
<div onClick={handleClick} aria-disabled={disabled}>
    <CheckBox checked={isChecked} disabled={disabled} readOnly> <span>{coupon.name}</span>
    </CheckBox>
    {couponMetaList.map(meta => <span>{meta}</span>)}
</div>
```

## Modal

> Modal 고유의 기능만을 담은 하위 컴포넌트들만 만들 예정.

### props

- width = "auto"
- height = "auto"
- onDimmedClick

### Modal.Header

### Modal.Main

### Modal.Footer

### Modal.CloseButton

## CheckoutItem

> Item Headless 컴포넌트 사용.

### views

```
<Item>
    <Item.Main>
        <Item.Thumbnail />
        <div>
            <Item.TextSm /> // 여긴 상품 이름
            <Item.TextXl /> // 상품 가격
            <Item.TextSm /> // 상품 개수
        </div>
    </Item.Main>
</Item>
```

## CheckoutSummary

> Summary Headless 컴포넌트 사용.

### views

```
<Summary>
    <Summary.Message />
    <Summary.Breakdown>
        <Summary.Item />
    </Summary.Breakdown>
    <Summary.Result>
        <Summary.Item />
    </Summary.Result>
</Summary>
```

## Summary

### Summary.Message

> className: 'typo-sm-r'

### Summary.Breakdown

### Summary.Result

### Summary.Item

> className: label -> 'typo-md-b', value -> 'typo-xl-b'

#### props

- label
- value

## Item

### Item.Header

### Item.Main

### Item.Thumbnail

#### props

- src
- alt

### Item.Stepper

#### props

- onDecrease()
- onIncrease()
- value
- decreaseDisabled
- increaseDisabled

### Item.TextXl

> className: `typo-xl-b`

### Item.TextMd

> className: `typo-md-b`

### Item.TextSm

> className: `typo-sm-r`

# hooks

## useCheckout

> CheckoutPage에서 쓰임.
> `GET /checkouts/:checkoutId`, `DELETE /checkouts/:checkoutId`, `POST /checkouts/:checkoutId/payment`
> CheckoutData에 영향을 끼치는 애들만 모아두는 곳
> `GET /checkouts/:checkoutId`가 SSOT. invalidate 여부의 기준은 "변경 후 같은 화면에 그 결과를 반영해야 하는가"이다.
>
> - DELETE(cancel): 페이지를 이탈하며 checkout 자체가 삭제됨. 재요청하면 404 → invalidate 불필요(오히려 위험)
> - POST(payment): 응답 body(item_count/total_quantity/total_amount)를 navigate state로 받아 `/order-success`로 넘김. 이 checkout으로 돌아오지 않음(replace) → invalidate 불필요
> - POST(payment)는 현재 checkout의 `remoteArea`, 선택된 couponIds를 같이 보낸다.

### export values

- isLoading
- hasError
- checkoutItemList
- couponList
- orderAmount
- couponDiscount
- shippingFee
- totalAmount
- remoteArea
- refetch
- cancelCheckout
- submitCheckout

## useUpdateCheckout

> `PATCH /checkouts/:checkoutId/address`, `PATCH /checkouts/:checkoutId/coupons`
>
> - PATCH(address/coupons): 204라 응답 body가 없고 같은 화면에 머물며 파생값(couponDiscount/shippingFee/totalAmount)을 다시 보여줘야 함 → invalidate 후 재요청
> - invalidate는 `useMyMutation`이 mutation 종료 시 자동으로 수행한다. 따라서 훅에서 수동 refetch를 호출하지 않는다(이중 요청 방지).
> - 두 PATCH는 같은 SSOT(`GET /checkouts`)를 갱신하므로 **공유 `pending` 하나로 묶는다.** 하나가 진행 중이면 배송지 체크박스와 쿠폰 적용 버튼을 **둘 다 잠근다.** (배송지 변경이 무료배송 쿠폰 할인액에 영향을 주므로 계산 전제가 흔들리는 것을 막기 위함)

### states

- [pending, setPending] // address/coupons가 공유. 둘 중 하나라도 진행 중이면 true.

### useMyMutation(queryKey, mutationFn)

> mutationFn은 apis/checkout.ts의 함수에 checkoutId를 함께 넘기는 형태로 만든다.

- useMyMutation(checkoutQueryKey(checkoutId), (isRemoteArea) => updateCheckoutAddress(checkoutId, isRemoteArea))
- useMyMutation(checkoutQueryKey(checkoutId), (selectedCouponIds) => updateCheckoutCoupons(checkoutId, selectedCouponIds))

### functions

> 각 함수는 공유 `pending`을 올렸다 내리며(setPending) 해당 mutate를 호출한다.

- export updateRemoteArea(isRemoteArea: boolean) // setPending(true) → mutate → (자동 invalidate) → setPending(false)
- export updateAppliedCoupon(selectedCouponIds: number[]) // 동일 패턴
- export pending // 컴포넌트가 잠금 처리에 사용

## useCalculateCoupon(checkoutId, initialCouponIds=[], initialDiscount=0)

> 쿠폰 모달에서 쓰임

### useCouponPolicy

- { maxCouponCount }

### useMyQuery()

- isLoading
- data: estimatedCouponDiscount

#### parameter

- queryKey: discountPreviewQueryKey(checkoutId, selectedCouponIds) // selectedCouponIds가 바뀔 때마다 키가 달라져 자동 재요청
- queryFn: getCouponDiscount(checkoutId, selectedCouponIds)
- queryOptions: {initialData: isDirty ? undefined : initialDiscount}

### states

- [selectedCouponIds, setSelectedCouponIds] (초기값: initialCouponIds)

### derived variables

- isPending: isLoading === true,
- isDirty: initialCouponIds와 비교해서 하나라도 바뀌었다면 true, 그대로라면 false.

### functions

- toggleCouponCheckBox(id, checked)
  - 만약 checked가 true인데 이미 selectedCouponIds.length가 maxCouponCount라면 return;
  - id가 selectedCouponIds에 있으면서 checked false라면 selectedIds에서 제거.
  - id가 selectedCouponIds에 없으면서 checked true라면 selectedCouponIds에 추가.
  - 나머지는 return;

## useShippingPolicy

> CheckoutSummary, CartOrderSummary에서 쓰임.

- freeShippingThreshold

## useCouponPolicy

> CouponModal, useCalculateCoupon에서 쓰임.

- maxCouponCount
