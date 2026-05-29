// 장바구니 상품 목록 조회
export interface CartResponse {
    id: number;
    products: {
        id: number;
        name: string;
        price: number;
        imgUrl: string;
        quantity: number;
    }[];
}

// 장바구니 상품 수량 변경
export interface UpdateCartItemQuantityResponse {
    id: number; // product id,
    name: string;
    price: number;
    imgUrl: string;
    quantity: number;
}

export interface UpdateCartItemQuantityRequest {
    quantity: number;
}

// 장바구니 상품 삭제
// No Content
