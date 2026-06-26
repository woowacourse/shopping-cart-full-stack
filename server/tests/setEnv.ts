// 테스트는 docker-compose의 postgres-test(5433) 인스턴스를 사용한다.
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgres://shopping:shopping@localhost:5433/shopping_cart_test";
