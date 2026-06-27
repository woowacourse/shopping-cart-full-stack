import "dotenv/config";
import { supabase } from "./supabase";

const products = [
  {
    name: "스타벅스 아메리카노",
    price: 4500,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
    stock: 10,
  },
  {
    name: "블루보틀 라떼",
    price: 6000,
    image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=300",
    stock: 10,
  },
  {
    name: "이디야 카페모카",
    price: 4800,
    image: "https://images.unsplash.com/photo-1542990253-0b8be9d10f51?w=300",
    stock: 10,
  },
  {
    name: "투썸 케이크",
    price: 7500,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300",
    stock: 10,
  },
];

const carts = [
  { product_id: 1, quantity: 2 },
  { product_id: 3, quantity: 1 },
];

const seed = async () => {
  const { data: productData, error: productError } = await supabase
    .from("products")
    .insert(products)
    .select();

  if (productError) {
    console.error("상품 시드 실패:", productError.message);
    return;
  }
  console.log("상품 시드 완료:", productData);

  const { data: cartData, error: cartError } = await supabase
    .from("carts")
    .insert(carts)
    .select();

  if (cartError) {
    console.error("장바구니 시드 실패:", cartError.message);
  } else {
    console.log("장바구니 시드 완료:", cartData);
  }
};

seed();
