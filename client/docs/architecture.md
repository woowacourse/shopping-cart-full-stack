# Route

/cart
/order-confirm

---

# interface

## CartItem

{
id: number;
name: string;
imageUrl: string;
price: number;
quantity: number;
isSelected: boolean; // getDefaultItemSelectPolicy(id)
isAvailable: boolean; // 서버에서 사라진 상품인 경우 false
errorMsg?: string;
}

## OrderSummary

{
cartItemCount: number;
totalQuantity: number;
totalAmount: number;
}

# hooks

## useCartForm

> cartPage에서 호출

### states

- cartList: CartItem[]
- status: "loading", "success", "error"

### derived variables

- isLoading: status === "loading"
- hasError: status === "error"
- hasNoCartItem: status === "success" && cartList.length === 0
- hasCartItem: status === "success" && cartList.length > 0
- orderAmount: cartList에서 isSelected && isAvailable && price \* quantity
- shippingFee: calculateShippingFee(orderAmount)
- totalAmount = orderAmount + shippingFee
- isAbleToPurchase: status !== "loading" && filter(isSelected && isAvailable).length > 0
- isAllSelected: boolean // cartList.length > 0 && cartList.every(item => item.isSelected)

### functions

- deleteCartItem(id): 낙관적 업데이트. 실패 시 해당 아이템만 복원.
- toggleItemSelection(id): 선택 상태 토글 및 로컬스토리지 저장
- toggleAllItemSelection(): 전체선택이 되어있다면 전체 선택해제하고, 전체해제되어있다면 전체선택하고, 일부선택이 되어있다면 전체선택한다.
- handleUpdateCartItemQuantity(id, quantity): PATCH API 호출. 성공 시 quantity 업데이트, 실패 시 errorMsg 설정.
- submitCart(): 서버에 있는 최신 장바구니를 다시 불러와 quantity를 동기화하고, 서버에서 사라진 상품은 구매 불가능 상태로 변경한 뒤 주문서를 반환.
  내부적으로 validateCartForm을 호출한다.

## useUpdateCartItemQuantity

> CartListItem에서 호출

### parameters

- onQuantityUpdate: (id: number, quantity: number) => Promise<void>

### states

- status: "idle", "pending", "error"

### derived variables

- isPending: status === "pending"

### functions

- increaseCartItemQuantity(id, quantity)
- decreaseCartItemQuantity(id, quantity)

---

# Page

## CartPage

### useCartForm hook

- cartList: CartItem[]
- isLoading, hasError, hasNoCartItem, hasCartItem
- derived..
- functions..

### functions

- handleSubmitCart: submitCart가 주문서를 반환하면 OrderConfirmPage로 이동. state에 주문서 포함.
  (orderSummary: { cartItemCount, totalQuantity, totalAmount })

### views

```
<Header>
    <Header.Title>SHOP</Header.Title>
</Header>
<main>
    <h1>장바구니</h1>
    {isLoading && <SkeletonList />}
    {hasError && <ErrorList />}
    {hasNoCartItem && <EmptyCartList />}
    {hasCartItem && (
        <form id="cart-form" onSubmit={handleSubmitCart}>
            <CartList />
        </form>
    )}
</main>
<footer>
    <Button type="submit" form="cart-form" disabled={!isAbleToPurchase}>
        <span className="typo-md-b">주문 확인</span>
    </Button>
</footer>
```

## OrderConfirmPage

> state.orderSummary가 없다면 CartPage로 이동

### views

```
<Header>
    <Header.BackButton />
</Header>
<main>
    <h1>주문 확인</h1>
    <p>
        총 {cartItemCount}종류의 상품 {totalQuantity}개를 주문합니다.
        <br />
        최종 결제 금액을 확인해 주세요.
    </p>
    <div>
        <p>총 결제 금액</p>
        <p>{formatPrice(totalAmount)}</p>
    </div>
</main>
<footer>
    <Button disabled>
        <span className="typo-md-b">결제하기</span>
    </Button>
</footer>
```

# Components

## Header

### functions

- Header.Title
- Header.BackButton: 이전 페이지로 이동

### views

```
<header>
    {children}
</header>
```

## SkeletonList

### views

```
<div>
    <div>
        <div /> // 15px
    </div>
    <div /> // 24px
    {Array.from({ length: 2 }).map(() => (
        <div>
            <div /> // 160px
        </div>
    ))}
    <div>
        <div /> // 16px
        <div /> // 92px
        <div /> // 42px
    </div>
</div>
```

## EmptyCartList

### views

```
<div>
    <p>장바구니에 담은 상품이 없습니다.</p>
</div>
```

## ErrorList

### views

```
<div>
    <p>오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
    <div>
        <Button>
            <span className="typo-md-b">다시 시도</span>
        </Button>
    </div>
</div>
```

## CartList

### props

- cartList: CartItem[]
- isAllSelected
- toggleItemSelection
- deleteCartItem
- toggleAllItemSelection
- onQuantityUpdate
- orderAmount, shippingFee, totalAmount

### views

```
<p>현재 {cartList.length}종류의 상품이 담겨있습니다.</p>

<Checkbox checked={isAllSelected} onChange={toggleAllItemSelection}>
    <span>전체선택</span>
</Checkbox>
{cartList.map((cartItem) => <CartListItem key={cartItem.id} cartItem={cartItem} onSelect={toggleItemSelection} onDelete={deleteCartItem} onQuantityUpdate={onQuantityUpdate} />)}
<CartOrderSummary orderAmount={orderAmount} shippingFee={shippingFee} totalAmount={totalAmount}/>
```

## CartListItem

> disabled 상태(더이상 구매 불가능)도 하나 있어야 함.

### props

- cartItem: {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  isSelected: boolean; // getDefaultItemSelectPolicy(id)
  isAvailable: boolean; // 서버에서 사라진 상품인 경우 false
  errorMsg?: string;
  }
- onQuantityUpdate: handleUpdateCartItemQuantity가 내려옴
- onSelect
- onDelete

### useUpdateCartItemQuantity hook

- isPending
- increaseCartItemQuantity
- decreaseCartItemQuantity

### variables

- isPurchaseDisabled = !cartItem.isAvailable;

### views

```
<div>
    <div>
        <Checkbox checked={isSelected} disabled={isPurchaseDisabled} onChange={() => onSelect(id)} />
        <Button variant="secondary" fit onClick={() => onDelete(id)}>삭제</Button>
    </div>
    <div>
        <img src={imageUrl} alt={name} />
        <div>
            <span>{name}</span>
            <span>{formatPrice(price)}</span>
            <div>
                <Button variant="icon" onClick={decreaseCartItemQuantity} disabled={quantity === 1 || isPurchaseDisabled}>
                    <MinusIcon />
                </Button>
                <span>{quantity}</span>
                <Button variant="icon" onClick={increaseCartItemQuantity} disabled={isPending || isPurchaseDisabled}>
                    <PlusIcon />
                </Button>
                {errorMsg && <span>{errorMsg}</span>}
            </div>
        </div>
    </div>
</div>
```

## CartOrderSummary

### props

- orderAmount, shippingFee, totalAmount

### views

```
<div>
    <InfoIcon />
    <p>총 주문 금액이 {formatPrice(getShippingFeePolicy())} 이상일 경우 무료 배송됩니다.</p>
</div>
주문 금액 {formatPrice(orderAmount)}
배송비 {formatPrice(shippingFee)}
총 결제 금액 {formatPrice(totalAmount)}
```

## Checkbox

- size option이 있으면 checkbox 크기 변경
- children이 있으면 label로 같이 렌더링
- disabled이면 checkbox와 label 모두 비활성 스타일

## Button

- variant가 primary, secondary, icon 필요.
- width는 100%가 기본
- icon은 24x24가 기본
- fit option이 있으면 padding 포함해서 auto width

## Typo class

- 종류가 xl, md, sm
- r, b weight가 있음
- xl은 24 lh 1, md는 16 lh 16, sm은 12 lh 15
