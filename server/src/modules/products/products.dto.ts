export interface ProductResponse {
    id: number;
    price: number;
    name: string;
    imgUrl: string;
}

export interface ProductRequest {
    price: number;
    name: string;
    imgUrl: string;
}
