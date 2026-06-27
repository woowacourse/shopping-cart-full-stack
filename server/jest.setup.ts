// 테스트는 항상 인메모리 저장소를 사용한다. (쉘에 SUPABASE_URL 등이 있어도 영향받지 않도록)
process.env.DATA_SOURCE = 'memory';
