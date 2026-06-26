export interface OrderItem {
  product_id: string;
  quantity: number;
  product: {
    name: string;
    thumbnail: string;
    price: number;
  };
}

export interface Order {
  id: string;
  hard_delivery_place: boolean;
  selected_coupons: string[];
  selected_items: OrderItem[];
  price_summary: {
    order_price: number;
    discount_price: number;
    delivery_price: number;
    total_price: number;
  };
}

export interface Coupon {
  id: string;
  name: string;
  expiration_date: string;
  description: string;
  is_active: boolean;
}
